import { Component } from "../component";

export class Rectangle extends Component {
  protected __component = Rectangle.name;

  constructor(public width = 0, public height = 0) {
    super();
  }
}
