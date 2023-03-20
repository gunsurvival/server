import {type, Schema} from '@colyseus/schema';
import {getStats} from '@gunsurvival/core';
import type * as EntityCore from '@gunsurvival/core/entity';
import Entity, {VectorSchema} from './Entity.js';

export class StatsBullet extends Schema {
	@type('number') radius: number;
}

export default class Bullet extends Entity {
	@type(StatsBullet)
		baseStats = new StatsBullet().assign(getStats('Bullet'));

	@type(StatsBullet)
		stats = new StatsBullet().assign(getStats('Bullet'));

	declare entityCore: EntityCore.Bullet;

	update() {
		super.update();
		this.stats.radius = this.entityCore.stats.radius;
	}
}
