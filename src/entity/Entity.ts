import type {ITickData} from '@gunsurvival/core/types';
import type {World} from '@gunsurvival/core/world';
import type {Entity} from '@gunsurvival/core/entity';
import {type, Schema} from '@colyseus/schema';
import {Effect} from '@gunsurvival/core/effect';

export class VectorSchema extends Schema {
	@type('number') x: number;
	@type('number') y: number;
}

export default abstract class Entity extends Schema {
	@type('number') scale: number;
	@type('number') angle: number;
	@type([Effect]) effects: Effect[] = [];
	@type(VectorSchema) pos: VectorSchema = new VectorSchema().assign({x: 0, y: 0});
	@type(VectorSchema) offset: VectorSchema = new VectorSchema().assign({x: 0, y: 0});

	entityCore: Effect; // Deo hieu sao lai bi any type o day

	abstract stats: unknown; // Need to be re-define interface in child class (with colyseus schema)

	afterUpdate(world: World, tickData: ITickData) {
		this.pos.x = body.pos.x;
		this.pos.y = body.pos.y;
		this.angle = body.angle;
		this.scale = body.scale;
		this.offset.x = body.offset.x;
		this.offset.y = body.offset.y;
	}

	abstract update(world: World, tickData: ITickData): void;
	abstract onInit(world: World): void; // Call after entity is added to world
	abstract onDestroy(world: World): void; // Call after entity is removed from world
	abstract onCollisionEnter(other: Entity, response: Response): void;
	abstract onCollisionStay(other: Entity, response: Response): void;
	abstract onCollisionExit(other: Entity, response: Response): void;
}
