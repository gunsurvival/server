import {type} from '@colyseus/schema';
import type * as EntityCore from '@gunsurvival/core/entity';
import Entity, {VectorSchema} from './Entity.js';

export default class Bullet extends Entity {
	@type(VectorSchema)
		vel: VectorSchema = new VectorSchema().assign({x: 0, y: 0});

	update() {
		super.update();
		this.vel.x = (this.entityCore as EntityCore.Bullet).vel.x;
		this.vel.y = (this.entityCore as EntityCore.Bullet).vel.y;
	}
}
