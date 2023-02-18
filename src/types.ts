import type Entity from '@gunsurvival/core/entity';
import type {Casual as Player} from '@gunsurvival/core/player';

export type ServerToClientEvents = {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
};

export type ClientToServerEvents = {
	hello: () => void;
};

export type InterServerEvents = {
	ping: () => void;
};

export type SocketData = {
	name: string;
	age: number;
};

export type UserData = {
	player: Player<Entity>;
};
