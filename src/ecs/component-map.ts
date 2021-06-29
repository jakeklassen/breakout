import { ComponentConstructor, Component } from "./world";

export class ComponentMap {
  #map = new Map<ComponentConstructor, Component>();

  public add(...components: Component[]): void {
    for (const component of components) {
      this.#map.set(component.constructor as ComponentConstructor, component);
    }
  }

  public delete(...componentConstructors: ComponentConstructor[]): void {
    componentConstructors.forEach((constructor) => {
      return this.#map.delete(constructor);
    });
  }

  public clear() {
    this.#map.clear();
  }

  get size(): number {
    return this.#map.size;
  }

  /**
   * Will assert all constructors are in the map
   * @param componentConstructors
   * @returns
   */
  public has(...componentConstructors: ComponentConstructor[]): boolean {
    return componentConstructors.every((constructor) => {
      return this.#map.has(constructor);
    });
  }
}
