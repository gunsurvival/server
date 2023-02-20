import {Room, type Client} from 'colyseus';
import * as WorldCore from '@gunsurvival/core/world';
import * as EntityCore from '@gunsurvival/core/entity';
import * as World from '../world/index.js';
import {type UserData} from '../types.js';
import * as Player from '@gunsurvival/core/player';
import SAT from 'sat';

export default class Casual extends Room<World.default> {
	isPaused = false;
	targetDelta: number;
	elapsedMs = 0;
	accumulator = 0;

	onCreate() {
		const worldCore = new WorldCore.Casual();
		this.setState(new World.Casual());
		this.state.useWorld(worldCore);

		let a: EntityCore.default;
		for (let i = -5000; i < 5000; i += Math.random() * 1000) {
			for (let j = -5000; j < 5000; j += Math.random() * 1000) {
				const rock = new EntityCore.Rock(new SAT.Vector(i, j));
				worldCore.add(rock);
				a = rock;
			}
		}

		// SetInterval(() => {
		// 	this.state.add(a);
		// }, 1000);

		this.onMessage('keyUp', (client, message: string) => {
			switch (message) {
				case 'w':
					(client.userData as UserData).player.state.keyboard.w = false;
					break;
				case 'a':
					(client.userData as UserData).player.state.keyboard.a = false;
					break;
				case 's':
					(client.userData as UserData).player.state.keyboard.s = false;
					break;
				case 'd':
					(client.userData as UserData).player.state.keyboard.d = false;
					break;
				default:
					break;
			}
		});

		this.onMessage('keyDown', (client, message: string) => {
			switch (message) {
				case 'w':
					(client.userData as UserData).player.state.keyboard.w = true;
					break;
				case 'a':
					(client.userData as UserData).player.state.keyboard.a = true;
					break;
				case 's':
					(client.userData as UserData).player.state.keyboard.s = true;
					break;
				case 'd':
					(client.userData as UserData).player.state.keyboard.d = true;
					break;
				default:
					break;
			}
		});

		this.onMessage('mouseDown', (client, message: string) => {
			switch (message) {
				case 'left':
					(client.userData as UserData).player.state.mouse.left = true;
					break;
				case 'middle':
					(client.userData as UserData).player.state.mouse.middle = true;
					break;
				case 'right':
					(client.userData as UserData).player.state.mouse.right = true;
					break;
				default:
					break;
			}
		});

		this.onMessage('mouseUp', (client, message: string) => {
			switch (message) {
				case 'left':
					(client.userData as UserData).player.state.mouse.left = false;
					break;
				case 'middle':
					(client.userData as UserData).player.state.mouse.middle = false;
					break;
				case 'right':
					(client.userData as UserData).player.state.mouse.right = false;
					break;
				default:
					break;
			}
		});

		this.startSimulate(64);
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, 'JOINED');
		const gunner = new EntityCore.Gunner();
		client.userData = {};
		(client.userData as UserData).player = new Player.Casual();
		(client.userData as UserData).player.playAs(gunner);
		(client.userData as UserData).entityId = gunner.id;
		this.state.worldCore.add(gunner);
	}

	onLeave(client: Client) {
		console.log(client.sessionId, 'LEFT!');
		// Const entity = this.state.entities.get(client.userData.entityId);

		// Entity may be already dead.
		// if (entity) {
		// Entity.dead = true;
		// }
	}

	startSimulate(tps = 64) {
		this.targetDelta = 1000 / tps;
		const currentTime = performance.now();
		while (this.isPaused) {
			const deltaMs = performance.now() - currentTime;
			this.accumulator += deltaMs;
			while (this.accumulator >= this.targetDelta) {
				this.accumulator -= this.targetDelta;
				const tickData = {
					accumulator: this.accumulator,
					elapsedMs: this.elapsedMs,
					deltaMs: this.targetDelta,
					delta: 1,
				};

				this.clients.forEach(client => {
					(client.userData as UserData).player.update(this.state.worldCore, tickData);
				});
				this.state.nextTick(tickData);
				this.elapsedMs += this.targetDelta;
			}
		}
	}
}
