import { Component } from "./component";
import { ComponentMap } from "./component-map";

class Color extends Component {
  protected __component = Color.name;
}

class Rectangle extends Component {
  protected __component = Rectangle.name;
}

describe("ComponentMap", () => {
  it("should support adding components", () => {
    const cm = new ComponentMap();

    cm.add(new Color(), new Rectangle());

    expect(cm.size).toEqual(2);
    expect(cm.has(Color, Rectangle)).toEqual(true);
  });

  it("should support removing components", () => {
    const cm = new ComponentMap();

    cm.add(new Color(), new Rectangle());
    cm.delete(Rectangle);

    expect(cm.size).toEqual(1);
    expect(cm.has(Rectangle)).toEqual(false);
  });

  it("should support clearing components", () => {
    const cm = new ComponentMap();

    cm.add(new Color(), new Rectangle());
    cm.clear();

    expect(cm.size).toEqual(0);
    expect(cm.has(Color, Rectangle)).toEqual(false);
  });

  it("should support getting a component", () => {
    const cm = new ComponentMap();
    const color = new Color();

    cm.add(color, new Rectangle());
    const retrievedColor = cm.get(Color);

    expect(color).toEqual(retrievedColor);
  });
});
