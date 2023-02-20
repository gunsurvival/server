import {Server} from 'colyseus';
import {WebSocketTransport} from '@colyseus/ws-transport';
import {createServer} from 'http';
import express from 'express';
import CasualRoom from './room/Casual.js';

const port = Number(process.env.port) || 3000;
const app = express();
app.use(express.json());

const gameServer = new Server({
	transport: new WebSocketTransport({
		server: createServer(app),
		pingInterval: 5000,
		pingMaxRetries: 3,
	}),
});

try {
	await gameServer.listen(port);
	console.log(`Server listening on port ${port}`);
	gameServer.define('casual', CasualRoom).enableRealtimeListing();
} catch (err) {
	console.error(err);
}
