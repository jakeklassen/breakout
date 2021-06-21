// We want to create a world

import { ComponentMap } from "./component-map";

// | EntityId | Position | Color  | Component N ... |
// | -------- | -------- | ------ | --------------- |
// | 1        | {x, y}   | 'red'  |
// | 2        | {x, y}   | 'blue'

export type ComponentConstructor<T extends Component = Component> = new (
  ...args: any[]
) => T;

// WE WON'T BREAK THIS RULE
type EntityId = number;

export abstract class Component {
  protected readonly __component = true;
}

export class Position extends Component {
  x: number = 0;
  y: number = 0;
}

export class Dimensions extends Component {
  width: number = 0;
  height: number = 0;
}

export class Color extends Component {
  r: number = 0;
  g: number = 0;
  b: number = 0;
}
export class Shape extends Component {
  shape: string = "rect";
}

class World {
  #nextEntityId = 0;

  public entities: Map<EntityId, ComponentMap> = new Map();

  public createEntity(): EntityId {
    const entityId = this.#nextEntityId++;
    this.entities.set(entityId, new ComponentMap());

    return entityId;
  }

  public getEntityComponents(id: EntityId): ComponentMap | undefined {
    return this.entities.get(id);
  }
}

export default World;
