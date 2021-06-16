import { Vector2d } from "../components/vector2d";

type BrickConstructorOptions = {
  position: Vector2d;
  width: number;
  height: number;
  rgba: string;
  visible: boolean;
};

export class Brick {
  position: Vector2d;
  width: number;
  height: number;
  rgba: string;
  visible: boolean;

  /**
   * Create Brick
   */
  constructor({
    position,
    width,
    height,
    rgba,
    visible,
  }: BrickConstructorOptions) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.rgba = rgba;
    this.visible = visible;
  }
}
