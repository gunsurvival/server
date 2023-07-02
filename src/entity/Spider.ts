import Entity from './Entity.js';
import {type, Schema} from '@colyseus/schema';
import {getStats, type Entity as EntityCore} from '@gunsurvival/core';
import Mob from './Mob.js';

export class StatsSpider extends Schema {
	@type('number') health: number;
	@type('number') speed: number;
	@type('number') radius: number;
}

export default class Spider extends Mob {
	@type(StatsSpider) stats: StatsSpider = new StatsSpider().assign(getStats('Spider'));

	declare entityCore: EntityCore.Spider;

	update() {
		super.update();
	}
}
