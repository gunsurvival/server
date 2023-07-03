import {type, Schema} from '@colyseus/schema';
import {type ITickData} from '@gunsurvival/core';
import type * as EntityCore from '@gunsurvival/core/entity';
import type World from '../world/World.js';

export class VectorSchema extends Schema {
	@type('number') x: number;
	@type('number') y: number;
}

export default abstract class Entity extends Schema {
	@type('string') id: string;
	@type('string') name = this.constructor.name;
	@type('number') scale = 1;
	@type('number') angle = 0;
	@type(VectorSchema) pos: VectorSchema = new VectorSchema().assign({
		x: 0,
		y: 0,
	});

	@type(VectorSchema) vel: VectorSchema = new VectorSchema().assign({
		x: 0,
		y: 0,
	});

	abstract stats: Schema; // Redefine this in the child class (colyseus schema). Base stats that are not affected by effects
	abstract entityCore: EntityCore.default;

	init(entityCore: EntityCore.default) {
		this.id = entityCore.id;
		this.entityCore = entityCore;
		this.updateBase();
		this.updateStats(this.stats, this.entityCore._stats);
	}

	updateBase() {
		this.angle = this.entityCore.body.angle;
		this.scale = this.entityCore.body.scale;
		this.pos.x = this.entityCore.body.pos.x;
		this.pos.y = this.entityCore.body.pos.y;
		this.vel.x = this.entityCore.vel.x;
		this.vel.y = this.entityCore.vel.y;
	}

	updateStats(stats: Schema, coreStats: Record<string, unknown>) {
		for (const key in coreStats) {
			if (key in stats) {
				stats[key] = coreStats[key];
			}
		}
	}

	abstract update(world: World, tickData: ITickData): void;
}
