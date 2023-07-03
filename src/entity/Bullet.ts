import {type, Schema} from '@colyseus/schema';
import {getStats} from '@gunsurvival/core';
import type * as EntityCore from '@gunsurvival/core/entity';
import Entity from './Entity.js';

export class StatsBullet extends Schema {
	@type('number') radius: number;
}

export default class Bullet extends Entity {
	@type('number') speed = 0;
	@type('string') ownerId = '';

	@type(StatsBullet) stats = new StatsBullet().assign(getStats('Bullet'));
	entityCore: EntityCore.Bullet;

	initCore(entityCore: EntityCore.Bullet) {
		super.init(entityCore);
		this.speed = entityCore.speed;
		this.ownerId = entityCore.ownerId;
	}

	update() {
		this.updateStats(this.stats, this.entityCore._stats);
	}
}
