import {type, filterChildren, Schema, MapSchema} from '@colyseus/schema';
import type * as WorldCore from '@gunsurvival/core/world';
import type * as EntityCore from '@gunsurvival/core/entity';
import * as Entity from '../entity/index.js';
import {type ITickData} from '@gunsurvival/core/types';

export default abstract class World extends Schema {
	@type({map: Entity.default})
		entities = new MapSchema<Entity.default>();

	worldCore: WorldCore.default;

	useWorld(worldCore: WorldCore.default) {
		this.worldCore = worldCore;
		worldCore.entities.onAdd = (entityCore: EntityCore.default) => {
			console.log('server add ', entityCore.constructor.name);
			const EntityClass = (Entity as Record<string, unknown>)[entityCore.constructor.name] as new () => Entity.default;
			const entityInstance = new EntityClass().assign({entityCore});
			this.entities.set(entityCore.id, entityInstance);
		};

		worldCore.entities.onRemove = (entityCore: EntityCore.default) => {
			this.entities.delete(entityCore.id);
		};
	}

	nextTick(tickData: ITickData) {
		this.worldCore.nextTick(tickData);
		this.entities.forEach((entity: Entity.default) => {
			entity.update();
		});
	}

	add(entityCore: EntityCore.default) {
		this.worldCore.add(entityCore);
	}

	remove(entityCore: EntityCore.default) {
		this.worldCore.remove(entityCore);
	}
}
