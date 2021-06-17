import { Vector2d } from "./vector2d";

describe("vector2d", () => {
  it("should work", () => {
    expect(new Vector2d()).toMatchObject({
      x: 0,
      y: 0,
    });
  });
});
