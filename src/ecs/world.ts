// We want to create a world

import { Component } from "./component";
import { ComponentMap, SafeComponentMap } from "./component-map";
import { System } from "./system";

// | EntityId | Position | Color  | Component N ... |
// | -------- | -------- | ------ | --------------- |
// | 1        | {x, y}   | 'red'  |
// | 2        | {x, y}   | 'blue'

export type ComponentConstructor<T extends Component = Component> = new (
  ...args: any[]
) => T;

// WE WON'T BREAK THIS RULE
type EntityId = number;

class World {
  #nextEntityId = 0;

  public entities: Map<EntityId, ComponentMap> = new Map();
  public systems: Array<System> = [];

  public createEntity(): EntityId {
    const entityId = this.#nextEntityId++;
    this.entities.set(entityId, new ComponentMap());

    return entityId;
  }

  public removeEntity(entityId: number): boolean {
    return this.entities.delete(entityId);
  }

  public getEntityComponents(id: EntityId): ComponentMap | undefined {
    return this.entities.get(id);
  }

  public addEntityComponents(id: EntityId, ...components: Component[]): void {
    this.entities.get(id)?.add(...components);
  }

  public view<CC extends ComponentConstructor[]>(
    ...componentConstructors: CC
  ): Array<[EntityId, SafeComponentMap<CC>]> {
    const validEntities: Array<[EntityId, SafeComponentMap<CC>]> = [];

    for (const [entity, componentMap] of this.entities.entries()) {
      if (componentMap.has(...componentConstructors)) {
        validEntities.push([entity, componentMap as SafeComponentMap<CC>]);
      }
    }

    return validEntities;
  }

  public addSystems(...systems: System[]) {
    this.systems.push(...systems);
  }

  public updateSystems(dt: number) {
    this.systems.forEach((system) => system.update(this, dt));
  }

  public removeSystems(...systems: System[]) {
    this.systems = this.systems.filter((system) => !systems.includes(system));
  }
}

export default World;
