import { Vector2d } from "../components/vector2d.js";

export class Paddle {
  /**
   * @param {object} opts
   * @param {Vector2d} opts.position
   * @param {number} opts.width
   * @param {number} opts.height
   */
  constructor(opts) {
    this.position = opts.position;
    this.width = opts.width;
    this.height = opts.height;
  }

  /**
   * Return center position
   */
  get center() {
    return {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
  }
}
