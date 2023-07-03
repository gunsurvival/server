import {type} from '@colyseus/schema';
import {getStats, type Entity as EntityCore} from '@gunsurvival/core';
import Mob, {StatsMob} from './Mob.js';

export class StatsSpider extends StatsMob {}

export default class Spider extends Mob {
	@type(StatsSpider) stats: StatsSpider = new StatsSpider().assign(
		getStats('Spider'),
	);

	entityCore: EntityCore.Spider;

	update() {
		this.updateBase();
		this.updateStats(this.stats, this.entityCore._stats);
	}
}
