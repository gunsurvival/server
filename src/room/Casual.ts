import {SATVector} from 'detect-collisions';
import {type Client} from 'colyseus';
import * as WorldCore from '@gunsurvival/core/world';
import * as EntityCore from '@gunsurvival/core/entity';
import * as Player from '@gunsurvival/core/player';
import * as World from '../world/index.js';
import {type UserData} from '../types.js';
import Room from './Room.js';
import {genId} from '@gunsurvival/core';

export default class Casual extends Room {
	isPaused = false; // Send signal to world to pause
	confirmPaused = false; // Confirm world has paused
	targetDeltaMs: number;
	elapsedMs = 0;
	accumulator = 0;
	lastTime = performance.now();
	tps = 0;
	elapsedTick = 0;

	onCreate(opts: any) {
		super.onCreate(opts);
		const worldCore = new WorldCore.Casual();

		worldCore.event.on('collision', (entityCore: EntityCore.default, otherEntityCore: EntityCore.default) => {
			const uniqid = genId(entityCore, otherEntityCore);
			// This.broadcast('resolve-sync', uniqid);
		});

		this.setState(new World.Casual());
		this.state.useWorld(worldCore);
		this.generateWorld();
		this.startSimulate(128);
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, 'JOINED');
		const gunner = new EntityCore.Gunner();
		gunner.id = client.sessionId;
		client.userData = {};
		(client.userData as UserData).player = new Player.Casual();
		(client.userData as UserData).player.playAs(gunner);
		(client.userData as UserData).entityId = gunner.id;
		this.state.worldCore.add(gunner);
	}

	onLeave(client: Client) {
		console.log(client.sessionId, 'LEFT!');

		const entityCore = this.state.worldCore.entities.get(client.userData.entityId);
		if (entityCore) {
			this.state.worldCore.remove(entityCore);
		}
	}

	generateWorld() {
		for (let i = -5000; i < 5000; i += Math.random() * 1000) {
			for (let j = -5000; j < 5000; j += Math.random() * 1000) {
				const rock = new EntityCore.Rock(new SATVector(i, j));
				this.state.worldCore.add(rock);
			}
		}

		for (let i = -5000; i < 5000; i += Math.random() * 3000) {
			for (let j = -5000; j < 5000; j += Math.random() * 1000) {
				const bush = new EntityCore.Bush(new SATVector(i, j));
				this.state.worldCore.add(bush);
			}
		}
	}

	eventRegister() {
		super.eventRegister();

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

		this.onMessage('angle', (client, angle: number) => {
			(client.userData as UserData).player.entity.body.angle = angle;
		});
	}
}
