import {Room as RoomColyseus, type Client} from 'colyseus';
import * as WorldCore from '@gunsurvival/core/world';
import * as EntityCore from '@gunsurvival/core/entity';
import type * as World from '../world/index.js';
import {type UserData} from '../types.js';
import * as Player from '@gunsurvival/core/player';
import SAT from 'sat';

export default abstract class Room extends RoomColyseus<World.default> {
	isPaused = false; // Send signal to world to pause
	confirmPaused = false; // Confirm world has paused
	targetDeltaMs: number;
	elapsedMs = 0;
	accumulator = 0;
	lastTime = 0;
	tps = 0;
	elapsedTick = 0;
	counterTpsInterval: NodeJS.Timeout;

	onCreate(opts: any) {
		this.eventRegister();
		this.lastTime = performance.now(); // Important: Reset the lastTime
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, 'JOINED');
		const gunner = new EntityCore.Gunner();
		gunner.id = client.sessionId;
		client.userData = {};
		(client.userData as UserData).player = new Player.Casual();
		(client.userData as UserData).player.playAs(gunner);
		this.state.worldCore.add(gunner);
	}

	onLeave(client: Client) {
		console.log(client.sessionId, 'LEFT!');
		this.state.worldCore.entities.delete((client.userData as UserData).player.entity.id);
	}

	simulate(tps = 64) {
		const magicNumber = (0.46 * 128 / tps); // Based on 128 tps, best run on 1-1000tps
		// const magicNumber2 = (0.41 * 128 / tps); // Based on 128 tps, best run on 2000-10000tps
		this.targetDeltaMs = (1000 / tps);
		const deltaMs = performance.now() - this.lastTime;
		this.lastTime = performance.now();
		this.accumulator += deltaMs;
		while (this.accumulator >= this.targetDeltaMs) {
			this.elapsedTick++;
			this.accumulator -= this.targetDeltaMs;
			const tickData = {
				accumulator: this.accumulator,
				elapsedMs: this.elapsedMs,
				deltaMs: this.targetDeltaMs,
				delta: 1,
			};

			this.clients.forEach(client => {
				(client.userData as UserData).player.update(this.state.worldCore, tickData);
			});

			this.state.nextTick(tickData);
			this.elapsedMs += this.targetDeltaMs;
		}

		if (this.isPaused) {
			this.confirmPaused = true;
		} else {
			setImmediate(() => {
				this.simulate(tps);
			});
		}
	}

	pause() {
		this.isPaused = true;
		clearInterval(this.counterTpsInterval);
	}

	startSimulate(tps: number) {
		if (!this.confirmPaused) {
			this.confirmPaused = false;
			this.isPaused = false;
			this.lastTime = performance.now();
			this.countTps();
			this.simulate(tps);
		}
	}

	countTps() {
		this.counterTpsInterval = setInterval(() => {
			this.tps = this.elapsedTick;
			this.elapsedTick = 0;
			console.log('TPS: ', this.tps);
		}, 1000);
	}

	abstract eventRegister(): void;
	abstract generateWorld(): void;
}
