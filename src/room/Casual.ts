
import {Room, type Client} from 'colyseus';
import World from '../../../core/src/world/World.js';

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

				this.state.nextTick(tickData);
				this.elapsedMs += this.targetDelta;
			}
		}
	}
}
