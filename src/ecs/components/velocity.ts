import { Component } from "../component";

export class Velocity extends Component {
  protected __component = Velocity.name;

  constructor(public x = 0, public y = 0) {
    super();
  }
}
