import {Schema, type} from '@colyseus/schema';
import {getStats, type Entity as EntityCore} from '@gunsurvival/core';
import Entity from './Entity.js';

export class StatsRock extends Schema {
	@type('number') radius: number;
}

export default class Rock extends Entity {
	@type(StatsRock) stats: StatsRock = new StatsRock().assign(getStats('Rock'));
	entityCore: EntityCore.Rock;

	update() {
		this.updateBase();
		this.updateStats(this.stats, this.entityCore._stats);
	}
}
