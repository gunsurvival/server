import {type, Schema} from '@colyseus/schema';

export class StatsGunner extends Schema {
	@type('number') health: number;
	@type('number') speed: number;
	@type('number') radius: number;
}
