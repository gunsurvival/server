import {Schema, type} from '@colyseus/schema';
import {getStats, type Entity as EntityCore} from '@gunsurvival/core';
import Entity from './Entity.js';

class StatsRock extends Schema {
	@type('number') radius: number;
}

export default class Rock extends Entity {
	@type(StatsRock)
		stats: StatsRock = new StatsRock().assign(getStats('Rock'));

	update() {
		super.update();
		this.stats.radius = (this.entityCore as EntityCore.Rock).stats.radius;
	}
}
