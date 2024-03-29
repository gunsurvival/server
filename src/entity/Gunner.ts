import Entity from './Entity.js';
import {type, Schema} from '@colyseus/schema';
import {getStats, type Entity as EntityCore} from '@gunsurvival/core';

export class StatsGunner extends Schema {
	@type('number') health: number;
	@type('number') speed: number;
	@type('number') radius: number;
}

export default class Gunner extends Entity {
	@type(StatsGunner) stats: StatsGunner = new StatsGunner().assign(
		getStats('Gunner'),
	);

	entityCore: EntityCore.Gunner;

	update() {
		this.updateBase();
		this.updateStats(this.stats, this.entityCore._stats);

		if (this.stats.health <= 0) {
			this.entityCore.body.pos.x = Math.random() * 1000;
			this.entityCore.body.pos.y = Math.random() * 1000;
			this.entityCore._stats.health = 100;
		}
	}
}
