import { loadImage } from "./asset-loaders";
import { Brick } from "./entities/brick";

type LoadLevelOptions = {
  /**
   * Image URL
   */
  imagePath: string;

  /**
   * as units of `brickWidth`
   */
  levelWidth: number;

  /**
   * as units of `brickHeight`
   */
  levelHeight: number;

  brickWidth: number;
  brickHeight: number;
  brickXOffset: number;
  brickYOffset: number;
};

export class LevelManager {
  #currentLevel = 1;
  #numberOfLevels = 0;
  #levelWidth = 0;
  #levelHeight = 0;
  #brickWidth = 0;
  #brickHeight = 0;
  #brickXOffset = 0;
  #brickYOffset = 0;

  #image: HTMLImageElement | null = null;

  bricks: Brick[] = [];

  get currentLevelNumber() {
    return this.#currentLevel;
  }

  get isCurrentLevelWon() {
    return this.bricks.every((brick) => brick.visible === false);
  }

  get hasNextLevel() {
    return this.#currentLevel < this.#numberOfLevels;
  }

  get onLastLevel() {
    return this.#currentLevel === this.#numberOfLevels;
  }

  /**
   * Load new levels image
   */
  async loadLevels(opts: LoadLevelOptions) {
    this.#currentLevel = 0;
    this.bricks = [];

    const image = await loadImage(opts.imagePath);

    this.#image = image;
    this.#levelWidth = opts.levelWidth;
    this.#levelHeight = opts.levelHeight;
    this.#brickWidth = opts.brickWidth;
    this.#brickHeight = opts.brickHeight;
    this.#brickXOffset = opts.brickXOffset;
    this.#brickYOffset = opts.brickYOffset;
    this.#numberOfLevels = image.height / opts.levelHeight;

    return this;
  }

  /**
   * Change level
   */
  changeLevel(num: number) {
    if (num < 1 || num > this.#numberOfLevels) {
      throw new Error(`changeLevel(${num}): Out of range`);
    }

    if (this.#image == null) {
      throw new Error("Load levels image first");
    }

    this.bricks = generateBricks({
      image: this.#image,
      num,
      levelWidth: this.#levelWidth,
      levelHeight: this.#levelHeight,
      brickWidth: this.#brickWidth,
      brickHeight: this.#brickHeight,
      brickXOffset: this.#brickXOffset,
      brickYOffset: this.#brickYOffset,
    });

    this.#currentLevel = num;
  }

  gotoNextLevel() {
    this.changeLevel(this.#currentLevel + 1);
  }
}

type GenerateBricksOptions = {
  image: HTMLImageElement;
  num: number;
  levelWidth: number;
  levelHeight: number;
  brickWidth: number;
  brickHeight: number;
  brickXOffset: number;
  brickYOffset: number;
};

/**
 * Generate Brick array based on level data
 */
export const generateBricks = (opts: GenerateBricksOptions) => {
  const {
    image,
    num,
    levelWidth,
    levelHeight,
    brickWidth,
    brickHeight,
    brickXOffset,
    brickYOffset,
  } = opts;

  // Temporary canvas to render level on and read pixel data from
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");

  if (ctx == null) {
    throw new Error("generateBricks() - Failed to obtain 2d canvas context");
  }

  ctx.drawImage(
    image,
    0,
    (num - 1) * levelHeight,
    levelWidth,
    levelHeight,
    0,
    0,
    levelWidth,
    levelHeight,
  );

  const bricks: Brick[] = [];

  for (let row = 0; row < levelHeight; ++row) {
    for (let col = 0; col < levelWidth; ++col) {
      const pixel = ctx.getImageData(col, row, 1, 1);
      const data = pixel.data;
      const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;

      // Transparent pixel, no brick.
      // NOTE: Alpha is expressed in the range of 0 - 1, so we normalize the value
      // by dividing by 255.
      if (data[3] / 255 === 0) continue;

      bricks.push(
        new Brick({
          position: {
            x: col + brickXOffset + col * brickWidth,
            y: row + brickYOffset + row * brickHeight,
          },
          width: brickWidth,
          height: brickHeight,
          rgba,
          visible: true,
        }),
      );
    }
  }

  return bricks;
};
