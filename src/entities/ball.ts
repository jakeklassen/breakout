import { Vector2d } from "../components/vector2d";
import { ValueOf } from "../type-utils";

type BallConstructorOptions = {
  width: number;
  height: number;
  position: Vector2d;
  velocity: Vector2d;
  maxVelocity: Vector2d;
  paddleBounceFactor: Vector2d;
  brickCollisionSpeedBoost: Vector2d;
};

export class Ball {
  static State = {
    Free: "Free",
    OnPaddle: "OnPaddle",
  } as const;

  state: ValueOf<typeof Ball.State> = Ball.State.OnPaddle;

  width: number;
  height: number;

  position: Vector2d;
  velocity: Vector2d;
  maxVelocity: Vector2d;
  paddleBounceFactor: Vector2d;
  brickCollisionSpeedBoost: Vector2d;
  initialLaunchVelocity: Vector2d;

  /**
   * Create a Ball
   */
  constructor(opts: BallConstructorOptions) {
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
}


