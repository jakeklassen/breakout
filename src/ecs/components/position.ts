import { Component } from "../component";

export class Position extends Component {
  protected __component = Position.name;

  constructor(public x = 0, public y = 0) {
    super();
  }
}
