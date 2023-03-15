import {type, Schema} from '@colyseus/schema';
import {getStats} from '@gunsurvival/core';
import type * as EntityCore from '@gunsurvival/core/entity';
import Entity, {VectorSchema} from './Entity.js';

export class StatsBullet extends Schema {
	@type('number') radius: number;
}

export default class Bullet extends Entity {
	@type(StatsBullet)
		stats: StatsBullet = new StatsBullet().assign(getStats('Bullet'));

	@type(VectorSchema)
		vel: VectorSchema = new VectorSchema().assign({x: 0, y: 0});

	update() {
		super.update();
		this.stats.radius = (this.entityCore as EntityCore.Bullet).stats.radius;
		this.vel.x = (this.entityCore as EntityCore.Bullet).vel.x;
		this.vel.y = (this.entityCore as EntityCore.Bullet).vel.y;
	}
}
