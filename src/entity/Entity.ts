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
	@type(VectorSchema) vel: VectorSchema = new VectorSchema().assign({x: 0, y: 0});
	@type(VectorSchema) offset: VectorSchema = new VectorSchema().assign({x: 0, y: 0});

	entityCore: EntityCore.default;
	abstract stats: Schema; // Redefine this in the child class (colyseus schema). Base stats that are not affected by effects

	update() {
		this.updateAll();
	}

	updateAll() {
		this.angle = this.entityCore.body.angle;
		this.scale = this.entityCore.body.scale;
		this.pos.x = this.entityCore.body.pos.x;
		this.pos.y = this.entityCore.body.pos.y;
		this.vel.x = this.entityCore.vel.x;
		this.vel.y = this.entityCore.vel.y;
		this.offset.x = this.entityCore.body.offset.x;
		this.offset.y = this.entityCore.body.offset.y;
		this.updateStats(this.entityCore.stats, this.stats);
	}

	updateStats(coreStats: Record<string, unknown>, stats: Schema) {
		for (const key in coreStats) {
			if (key in stats) {
				stats[key] = coreStats[key];
			}
		}
	}

	init(entityCore: EntityCore.default) {
		this.id = entityCore.id;
		this.entityCore = entityCore;
		this.updateAll();
	}
}
