import Entity from './Entity.js';
import {type, Schema} from '@colyseus/schema';
import {getStats, type Entity as EntityCore} from '@gunsurvival/core';
import Mob from './Mob.js';

export class StatsWolf extends Schema {
	@type('number') health: number;
	@type('number') speed: number;
	@type('number') radius: number;
}

export default class Wolf extends Mob {
	@type(StatsWolf) stats: StatsWolf = new StatsWolf().assign(getStats('Wolf'));

	declare entityCore: EntityCore.Wolf;

	update() {
		super.update();
	}
}
