// We want to create a world

// | EntityId | Position | Color  | Component N ... |
// | -------- | -------- | ------ | --------------- |
// | 1        | {x, y}   | 'red'  |
// | 2        | {x, y}   | 'blue'

// WE WON'T BREAK THIS RULE
type EntityId = number;

export interface WorldItem {
  id: number;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  color: "red" | "blue";
  shape: "rect";
}

class Component {}

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
  private worldItems: WorldItem[] = [];
  // Literally is a table
  // TODO: Follow this through to implementation
  public entities: Map<EntityId, Component[]> = new Map();

  public addEntity() {
    this.entities.get(1);
  }

  public getWorldItems() {
    return this.worldItems;
  }

  public getWorldItem(id: EntityId) {
    return this.worldItems.find((x) => x.id === id);
  }

  public addWorldItem(worldItem: WorldItem) {
    this.worldItems.push(worldItem);
  }
}

export default World;
