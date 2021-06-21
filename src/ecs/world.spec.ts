import World from "./world";

describe("World", () => {
  describe("createEntity()", () => {
    it("returns a new entity", () => {
      const world = new World();
      const entity = world.createEntity();

      expect(entity).toBeDefined();
    });
  });

  describe("deleteEntity()", () => {
    it.todo("should remove the entity and return true");

    it.todo("should return false if entity does not exist");
  });

  describe("addEntityComponents()", () => {
    it.todo("should add components to entity component map");

    it.todo("should not throw an error if entity has been deleted");
  });

  describe("getEntityComponents()", () => {
    it("should return ComponentMap for existing entity", () => {
      const world = new World();
      const entityId = world.createEntity();

      const componentMap = world.getEntityComponents(entityId);

      expect(componentMap).toBeDefined();
    });

    it.todo("should return undefined for non-existing entity");

    it.todo("should return undefined for deleted entity");
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
    it.todo("should return the correct views");
  });
});
