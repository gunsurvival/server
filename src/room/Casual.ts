import {SATVector} from 'detect-collisions';
import {type ClientArray, type Client} from '@colyseus/core';
import * as WorldCore from '@gunsurvival/core/world';
import * as Player from '@gunsurvival/core/player';
import * as World from '../world/index.js';
import {type UserData} from '../types.js';
import Room from './Room.js';

export default class Casual extends Room {
	clients: ClientArray<UserData>; // Overwrite the type of clients
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
		this.setState(new World.Casual());
		this.state.useWorld(worldCore);
		this.generateWorld();
		this.startSimulate(128);
	}

	onJoin(client: Client<UserData>, options: any) {
		super.onJoin(client, options);
	}

	onLeave(client: Client<UserData>) {
		console.log(client.sessionId, 'LEFT!');

		this.state.worldCore.api('api:-entities', client.sessionId).catch(console.error);
	}

	generateWorld() {
		for (let i = -5000; i < 5000; i += Math.random() * 1000) {
			for (let j = -5000; j < 5000; j += Math.random() * 1000) {
				this.state.worldCore.api('api:+entities', 'Rock', {pos: new SATVector(i, j)}).catch(console.error);
			}
		}

		for (let i = -5000; i < 5000; i += Math.random() * 1000) {
			for (let j = -5000; j < 5000; j += Math.random() * 1000) {
				this.state.worldCore.api('api:+entities', 'Bush', {pos: new SATVector(i, j)}).catch(console.error);
			}
		}
	}

	eventRegister() {
		super.eventRegister();

		this.onMessage('keyUp', (client: Client<UserData>, message: string) => {
			if (!client.userData) {
				return;
			}

			switch (message) {
				case 'w':
					client.userData.player.state.keyboard.w = false;
					break;
				case 'a':
					client.userData.player.state.keyboard.a = false;
					break;
				case 's':
					client.userData.player.state.keyboard.s = false;
					break;
				case 'd':
					client.userData.player.state.keyboard.d = false;
					break;
				default:
					break;
			}
		});

		this.onMessage('keyDown', (client: Client<UserData>, message: string) => {
			if (!client.userData) {
				return;
			}

			switch (message) {
				case 'w':
					client.userData.player.state.keyboard.w = true;
					break;
				case 'a':
					client.userData.player.state.keyboard.a = true;
					break;
				case 's':
					client.userData.player.state.keyboard.s = true;
					break;
				case 'd':
					client.userData.player.state.keyboard.d = true;
					break;
				default:
					break;
			}
		});

		this.onMessage('mouseDown', (client: Client<UserData>, message: string) => {
			if (!client.userData) {
				return;
			}

			switch (message) {
				case 'left':
					client.userData.player.state.mouse.left = true;
					break;
				case 'middle':
					client.userData.player.state.mouse.middle = true;
					break;
				case 'right':
					client.userData.player.state.mouse.right = true;
					break;
				default:
					break;
			}
		});

		this.onMessage('mouseUp', (client: Client<UserData>, message: string) => {
			if (!client.userData) {
				return;
			}

			switch (message) {
				case 'left':
					client.userData.player.state.mouse.left = false;
					break;
				case 'middle':
					client.userData.player.state.mouse.middle = false;
					break;
				case 'right':
					client.userData.player.state.mouse.right = false;
					break;
				default:
					break;
			}
		});

		this.onMessage('angle', (client: Client<UserData>, angle: number) => {
			if (!client.userData) {
				return;
			}

			client.userData.player.entity.body.angle = angle;
		});

		this.onMessage('inventory-choose', (client: Client<UserData>, indexes: number[]) => {
			if (!client.userData) {
				return;
			}

			client.userData.player.entity.inventory.chooseMulti(indexes).catch(console.error);
		});
	}
}
