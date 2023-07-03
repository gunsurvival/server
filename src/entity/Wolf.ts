import {type} from '@colyseus/schema';
import {getStats, type Entity as EntityCore} from '@gunsurvival/core';
import Mob, {StatsMob} from './Mob.js';

export class StatsWolf extends StatsMob {}

export default class Wolf extends Mob {
	@type(StatsWolf) stats: StatsWolf = new StatsWolf().assign(getStats('Wolf'));
	entityCore: EntityCore.Wolf;

	update() {
		this.updateBase();
		this.updateStats(this.stats, this.entityCore._stats);
	}
}
