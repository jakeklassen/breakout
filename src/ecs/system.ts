import World from "./world";

export abstract class System {
  public abstract update(world: World, dt: number): void;
}
