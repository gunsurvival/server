import {type, Schema} from '@colyseus/schema';
import type {ITickData} from '@gunsurvival/core/types';
import type {World} from '@gunsurvival/core/world';
import type {Entity as EntityCore} from '@gunsurvival/core/entity';

export class VectorSchema extends Schema {
	@type('number') x: number;
	@type('number') y: number;
}

export default abstract class Entity extends Schema {
	@type('number') scale: number;
	@type('number') angle: number;
	@type(VectorSchema) pos: VectorSchema = new VectorSchema().assign({x: 0, y: 0});
	@type(VectorSchema) offset: VectorSchema = new VectorSchema().assign({x: 0, y: 0});

	entityCore: EntityCore;

	abstract stats: unknown; // Need to be re-define interface in child class (with colyseus schema)

	beforeUpdate(world: World, tickData: ITickData) {}

	afterUpdate(world: World, tickData: ITickData) {
		this.pos.x = this.entityCore.body.pos.x;
		this.pos.y = this.entityCore.body.pos.y;
		this.angle = this.entityCore.body.angle;
		this.scale = this.entityCore.body.scale;
		this.offset.x = this.entityCore.body.offset.x;
		this.offset.y = this.entityCore.body.offset.y;
	}

	abstract update(world: World, tickData: ITickData): void;
	abstract onInit(world: World): void; // Call after entity is added to world
	abstract onDestroy(world: World): void; // Call after entity is removed from world
	abstract onCollisionEnter(other: Entity, response: Response): void;
	abstract onCollisionStay(other: Entity, response: Response): void;
	abstract onCollisionExit(other: Entity, response: Response): void;
}
