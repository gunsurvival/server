import Entity from './Entity.js';
import {type, Schema} from '@colyseus/schema';
import {getStats, type Entity as EntityCore} from '@gunsurvival/core';

export class StatsMob extends Schema {
	@type('number') health: number;
	@type('number') speed: number;
	@type('number') radius: number;
}

export default abstract class Mob extends Entity {
	abstract stats: StatsMob;
	abstract entityCore: EntityCore.Mob;
}
