import { Component } from "../component";

export class Color extends Component {
  protected __component = Color.name;

  constructor(public color = "black") {
    super();
  }
}
