import {Server} from '@colyseus/core';
import {WebSocketTransport} from '@colyseus/ws-transport';
import {createServer} from 'http';
import cors from 'cors';
import express from 'express';
import {monitor} from '@colyseus/monitor';
import * as Room from './room/index.js';

const setTerminalTitle = (text: string) => {
	process.stdout.write(
		`${String.fromCharCode(27)}]0;${text}${String.fromCharCode(7)}`,
	);
};

const port = Number(process.env.port) || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/colyseus', monitor());

const gameServer = new Server({
	transport: new WebSocketTransport({
		server: createServer(app),
		pingInterval: 5000,
		pingMaxRetries: 3,
	}),
});

setInterval(() => {
	const memoryUsage = process.memoryUsage().heapTotal / 1024 / 1024;
	setTerminalTitle(
		`GUNSURVIVAL 3 SERVER - MEMORY: ${memoryUsage.toFixed(2)}MB`,
	);
}, 1000);

await gameServer.listen(port);
console.log(`Server listening on port ${port}`);

gameServer.define('casual', Room.Casual).enableRealtimeListing();
