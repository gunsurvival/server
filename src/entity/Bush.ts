import {getStats, type Entity as EntityCore} from '@gunsurvival/core';
import {type, Schema} from '@colyseus/schema';
import Entity from './Entity.js';

export class StatsBush extends Schema {
	@type('number') radius: number;
}

function updateStats(stats: StatsBush, entityCore: EntityCore.Bush) {
	stats.radius = entityCore.stats.radius;
}

export default class Bush extends Entity {
	@type(StatsBush) stats: StatsBush = new StatsBush().assign(getStats('Bush'));

	declare entityCore: EntityCore.Bush;
}
