import { Component } from "./component";
import { System } from "./system";
import World from "./world";

class Color extends Component {
  protected __component = Color.name;
}

class TestComponent extends Component {
  protected __component = TestComponent.name;
}

class Position extends Component {
  protected __component = TestComponent.name;
}

class MovementSystem extends System {
  update() {}
}

describe("World", () => {
  describe("createEntity()", () => {
    it("returns a new entity", () => {
      const world = new World();
      const entity = world.createEntity();

      expect(entity).toBeDefined();
    });
  });

  describe("removeEntity()", () => {
    it("should remove an existing entity and return true", () => {
      const world = new World();
      const entity = world.createEntity();

      expect(world.removeEntity(entity)).toEqual(true);
      expect(world.getEntityComponents(entity)).toBeUndefined();
    });

    it("should return false if entity does not exist", () => {
      const world = new World();

      expect(world.removeEntity(145)).toEqual(false);
    });
  });

  describe("addEntityComponents()", () => {
    it("should add components to entity component map", () => {
      const world = new World();
      const entityId = world.createEntity();
      const testComponent = new TestComponent();

      world.addEntityComponents(entityId, testComponent);

      expect(world.getEntityComponents(entityId)?.has(TestComponent)).toEqual(
        true,
      );
    });

    it("should allow adding multiple components to entity component map", () => {
      const world = new World();
      const entityId = world.createEntity();
      const testComponent = new TestComponent();
      const position = new Position();

      world.addEntityComponents(entityId, testComponent, position);

      expect(
        world.getEntityComponents(entityId)?.has(TestComponent, Position),
      ).toEqual(true);
    });

    it("should not throw an error if an entity does not exist", () => {
      const world = new World();

      expect(() =>
        world.addEntityComponents(Number.MAX_SAFE_INTEGER, new Position()),
      ).not.toThrowError();
    });
  });

  describe("getEntityComponents()", () => {
    it("should return ComponentMap for existing entity", () => {
      const world = new World();
      const entityId = world.createEntity();

      const componentMap = world.getEntityComponents(entityId);

      expect(componentMap).toBeDefined();
    });

    it("should return undefined for non-existing entity", () => {
      const world = new World();

      const componentMap = world.getEntityComponents(123);

      expect(componentMap).not.toBeDefined();
    });
  });

  describe("findEntity()", () => {
    it.todo("should return the correct entity");

    it.todo("should return the first matching entity by insertion order");

    it.todo("should return undefined when not found");

    it.todo(
      "should return undefined when no component constructors are passed",
    );

    it.todo("should not return deleted entities");
  });

  describe("view()", () => {
    it("should return the correct views", () => {
      const world = new World();
      const entityId = world.createEntity();
      const testPosition = new Position();

      world.addEntityComponents(entityId, testPosition);
      expect(world.view(Position)).toEqual([
        [entityId, world.getEntityComponents(entityId)],
      ]);

      expect(world.view(Position, Color)).toEqual([]);
    });
  });

  describe("systems", () => {
    class SystemA extends System {
      public update(_world: World, _dt: number): void {}
    }

    class SystemB extends System {
      public update(_world: World, _dt: number): void {}
    }

    it("can add systems", () => {
      const world = new World();
      const movementSystem = new MovementSystem();
      movementSystem.update = jest.fn();
      world.addSystems(movementSystem);

      world.updateSystems(1 / 60);

      expect(movementSystem.update).toHaveBeenCalled();
    });

    it("can remove systems", () => {
      const world = new World();

      const systemA = new SystemA();
      const systemB = new SystemB();

      const systemAUpdateSpy = jest.spyOn(systemA, "update");
      const systemBUpdateSpy = jest.spyOn(systemB, "update");

      world.addSystems(systemA, systemB);

      world.updateSystems(1 / 60);

      expect(systemAUpdateSpy).toBeCalledTimes(1);
      expect(systemBUpdateSpy).toBeCalledTimes(1);

      world.removeSystems(systemB);
      world.updateSystems(1 / 60);

      expect(systemAUpdateSpy).toBeCalledTimes(2);
      expect(systemBUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it("should update systems in insertion order", () => {
      const world = new World();

      const systemA = new SystemA();
      const systemB = new SystemB();

      const systemAUpdateSpy = jest.spyOn(systemA, "update");
      const systemBUpdateSpy = jest.spyOn(systemB, "update");

      world.addSystems(systemA, systemB);

      world.updateSystems(1 / 60);

      expect(systemAUpdateSpy).toBeCalledTimes(1);
      expect(systemBUpdateSpy).toBeCalledTimes(1);

      // Assert call order!
      const [systemAUpdateSpyCallOrder] =
        systemAUpdateSpy.mock.invocationCallOrder;
      const [systemBUpdateSpyCallOrder] =
        systemBUpdateSpy.mock.invocationCallOrder;

      expect(systemAUpdateSpyCallOrder).toBeLessThan(systemBUpdateSpyCallOrder);
    });
  });
});
