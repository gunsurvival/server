import {Server} from 'colyseus';
import {WebSocketTransport} from '@colyseus/ws-transport';
import {createServer} from 'http';
import express from 'express';
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
} catch (err) {
	console.error(err);
}
