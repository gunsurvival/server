
import {Room, type Client} from 'colyseus';
import World from '../../../core/src/world/World.js';
import {type UserData} from '../types.js';

export default class Casual extends Room<World> {
	isPaused = false;
	targetDelta: number;
	elapsedMs = 0;
	accumulator = 0;

	onCreate() {
		this.setState(new World());

		this.onMessage('mouse', (client, message: any) => {
			const entity = this.state.entities.get(client.userData.id as string);

			// Skip dead players
			if (!entity) {
				console.log('DEAD PLAYER ACTING...');
			}
		});

		this.startSimulate(64);
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, 'JOINED');
		// This.state.createPlayer(client.sessionId);
	}

	onLeave(client: Client) {
		console.log(client.sessionId, 'LEFT!');
		const entity = this.state.entities.get(client.userData.entityId);

		// Entity may be already dead.
		if (entity) {
			// Entity.dead = true;
		}
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
					(client.userData as UserData).player.update(this.state, tickData);
				});
				this.state.nextTick(tickData);
				this.elapsedMs += this.targetDelta;
			}
		}
	}
}

/*
	Client simulation
	This.app.ticker.add(() => {
	this.accumulator += this.app.ticker.deltaMS;
	while (this.accumulator >= this.targetDelta) {
		this.accumulator -= this.targetDelta;
		const tickData = {
			accumulator: this.accumulator,
			elapsedMs: this.elapsedMs,
			deltaMs: this.targetDelta,
			delta: 1,
		};

		this.player.update(this.world, tickData);
		this.world.nextTick(tickData);
		this.elapsedMs += this.targetDelta;
	}

	const camX = -this.player.entity.displayObject.position.x + (this.viewport.screenWidth / 2);
	const camY = -this.player.entity.displayObject.position.y + (this.viewport.screenHeight / 2);
	this.viewport.position.set(lerp(this.viewport.position.x, camX, 0.05), lerp(this.viewport.position.y, camY, 0.05));

	const playerScreenPos = this.viewport.toScreen(this.player.entity.body.x, this.player.entity.body.y);
	this.player.entity.body.setAngle(lerpAngle(this.player.entity.body.angle, Math.atan2( // Online
		this.pointerPos.y - playerScreenPos.y,
		this.pointerPos.x - playerScreenPos.x,
	), 0.3));
});
*/

/*
	World generation
	for (let i = -5000; i < 5000; i += Math.random() * 1000) {
		for (let j = -5000; j < 5000; j += Math.random() * 1000) {
			const rock = new Rock({x: i, y: j} as SAT.Vector);
			this.world.add(rock);
		}
	}
*/
