import { Vector2d } from "../components/vector2d";

type PaddleConstructorOptions = {
  position: Vector2d;
  width: number;
  height: number;
};

export class Paddle {
  position: Vector2d;
  width: number;
  height: number;

  /**
   * Create paddle
   */
  constructor(opts: PaddleConstructorOptions) {
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
