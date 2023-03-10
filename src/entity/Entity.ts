import {type, Schema} from '@colyseus/schema';
import type * as EntityCore from '@gunsurvival/core/entity';

export class VectorSchema extends Schema {
	@type('number') x: number;
	@type('number') y: number;
}

export default abstract class Entity extends Schema {
	@type('string') id: string;
	@type('string') name = this.constructor.name;
	@type('number') scale = 1;
	@type('number') angle = 0;
	@type(VectorSchema) pos: VectorSchema = new VectorSchema().assign({x: 0, y: 0});
	@type(VectorSchema) offset: VectorSchema = new VectorSchema().assign({x: 0, y: 0});

	entityCore: EntityCore.default;

	update() {
		this.pos.x = this.entityCore.body.pos.x;
		this.pos.y = this.entityCore.body.pos.y;
		this.angle = this.entityCore.body.angle;
		this.scale = this.entityCore.body.scale;
		this.offset.x = this.entityCore.body.offset.x;
		this.offset.y = this.entityCore.body.offset.y;
	}
}
