import {type, Schema} from '@colyseus/schema';
import {getStats} from '@gunsurvival/core';
import type * as EntityCore from '@gunsurvival/core/entity';
import Entity from './Entity.js';

export class StatsBullet extends Schema {
	@type('number') radius: number;
}

export default class Bullet extends Entity {
	@type(StatsBullet) stats = new StatsBullet().assign(getStats('Bullet'));
	@type('number') speed = 0;

	declare entityCore: EntityCore.Bullet;

	update() {
		// This.angle = this.entityCore.body.angle;
		// this.scale = this.entityCore.body.scale;
		// This.speed = this.entityCore.speed;
		// super.update();
		this.updateStats(this.entityCore.stats, this.stats);
	}

	init(entityCore: EntityCore.Bullet) {
		super.init(entityCore);
		this.speed = entityCore.speed;
	}
}
