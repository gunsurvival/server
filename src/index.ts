import {Server} from 'colyseus';
import {WebSocketTransport} from '@colyseus/ws-transport';
import {createServer} from 'http';
import express from 'express';
import {monitor} from '@colyseus/monitor';
import CasualRoom from './room/Casual.js';

const setTerminalTitle = (text: string) => {
	process.stdout.write(
		`${String.fromCharCode(27)}]0;${text}${String.fromCharCode(7)}`,
	);
};

const port = Number(process.env.port) || 3000;
const app = express();
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
	const symbol = '=';
	setTerminalTitle(
		`GUNSURVIVAL 3 SERVER - MEMORY: ${memoryUsage.toFixed(
			2,
		)}MB`,
	);
}, 1000);

gameServer.listen(port).catch(console.error);
console.log(`Server listening on port ${port}`);
gameServer.define('casual', CasualRoom).enableRealtimeListing();
