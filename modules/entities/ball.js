import { Vector2d } from "../components/vector2d.js";

export class Ball {
  /**
   * @type {keyof Ball.State}
   */
  state = Ball.State.OnPaddle;

  /**
   * @type {Vector2d}
   */
  initialLaunchVelocity;

  /**
   * Create a Ball
   * @param {object} opts
   * @param {number} opts.width
   * @param {number} opts.height
   * @param {Vector2d} opts.position
   * @param {Vector2d} opts.velocity
   * @param {Vector2d} opts.maxVelocity
   * @param {Vector2d} opts.paddleBounceFactor
   * @param {Vector2d} opts.brickCollisionSpeedBoost
   */
  constructor(opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.position = opts.position;
    this.velocity = opts.velocity;
    this.maxVelocity = opts.maxVelocity;
    this.paddleBounceFactor = opts.paddleBounceFactor;
    this.brickCollisionSpeedBoost = opts.brickCollisionSpeedBoost;

    this.initialLaunchVelocity = {
      x: this.velocity.x,
      y: this.velocity.y,
    };
  }

  reset() {
    this.state = Ball.State.OnPaddle;
    this.velocity.x = this.initialLaunchVelocity.x;
    this.velocity.y = this.initialLaunchVelocity.y;
  }

  static State = {
    Free: /** @type {'Free'} */ ("Free"),
    OnPaddle: /** @type {'OnPaddle'} */ ("OnPaddle"),
  };
}
