import {type, filterChildren, Schema, MapSchema, ArraySchema} from '@colyseus/schema';
import type * as WorldCore from '@gunsurvival/core/world';
import type * as EntityCore from '@gunsurvival/core/entity';
import * as Entity from '../entity/index.js';
import {type ITickData} from '@gunsurvival/core/types';
import {type IEvent} from '@gunsurvival/core/world/World.js';

class EventSchema extends Schema {
	@type('string') type: string;
	@type('string') args: string;
}

export default abstract class World extends Schema {
	// @filterChildren((client, key: string, entity: Entity, root: World) => {
	// 	const currentPlayer = root.entities.get(client.userData.entityId as string);
	// 	if (currentPlayer) {
	// 		const a = entity.body.pos.x - currentPlayer.body.pos.x;
	// 		const b = entity.body.pos.y - currentPlayer.body.pos.y;

	// 		return (Math.sqrt((a * a) + (b * b))) <= 1366;
	// 	}

	// 	return false;
	// })
	@type([EventSchema]) events = new ArraySchema<EventSchema>();
	@type({map: Entity.default}) entities = new MapSchema<Entity.default>();

	worldCore: WorldCore.default;

	useWorld(worldCore: WorldCore.default) {
		this.worldCore = worldCore;

		worldCore.event.on('+entities', entityCore => {
			const EntityClass = Entity[entityCore.name] as new () => Entity.default;
			const entity = new EntityClass();
			entity.init(entityCore);
			this.entities.set(entityCore.id, entity);
		});

		worldCore.event.on('-entities', entityCore => {
			this.entities.delete(entityCore.id);
		});

		worldCore.event.on('+events', (event: IEvent) => {
			try {
				this.events.push(new EventSchema().assign({
					type: event.type,
					args: JSON.stringify(event.args),
				}));
			} catch (e) {
				console.log(event);
			}
		});
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

