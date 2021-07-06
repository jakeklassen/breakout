import { Component, ComponentConstructor } from "./world";

export type SafeComponentMap<T extends ComponentConstructor[]> = {
  // ComponentMap['get'] overload for specific component constructors
  get<C extends T[number]>(ctor: C): InstanceType<C>;
} & ComponentMap;

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

  public get<T extends Component>(
    componentConstructor: ComponentConstructor<T>,
  ): T | undefined {
    return this.#map.get(componentConstructor) as T;
  }
}
