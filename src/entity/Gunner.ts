import Entity from './Entity.js';
import {type, Schema} from '@colyseus/schema';
import {getStats, type Entity as EntityCore} from '@gunsurvival/core';

export class StatsGunner extends Schema {
	@type('number') health: number;
	@type('number') speed: number;
	@type('number') radius: number;
}

export default class Gunner extends Entity {
	@type(StatsGunner) stats: StatsGunner = new StatsGunner().assign(getStats('Gunner'));

	update() {
		super.update();
		this.stats.health = (this.entityCore as EntityCore.Gunner).stats.health;
		this.stats.speed = (this.entityCore as EntityCore.Gunner).stats.speed;
		this.stats.radius = (this.entityCore as EntityCore.Gunner).stats.radius;
	}
}
