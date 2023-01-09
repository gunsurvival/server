import express, {type Express, Request, Response} from 'express';
import {Server} from 'socket.io';
import type * as types from './types';

const app: Express = express();
const io = new Server<types.ClientToServerEvents, types.ServerToClientEvents, types.InterServerEvents, types.SocketData>();
const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
	console.log(`Server listen: *${port}`);
});

io.on('connection', socket => {
	socket.emit('noArg');
	socket.emit('basicEmit', 1, '2', Buffer.from([3]));
	socket.emit('withAck', '4', e => {
		// E is inferred as number
	});

	// Works when broadcast to all
	io.emit('noArg');

	// Works when broadcasting to a room
	io.to('room1').emit('basicEmit', 1, '2', Buffer.from([3]));
});
