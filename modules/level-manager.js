import { loadImage } from "./asset-loaders.js";
import { Brick } from "./entities/brick.js";

export class LevelManager {
  #currentLevel = 1;
  #numberOfLevels = 0;
  #levelWidth = 0;
  #levelHeight = 0;
  #brickWidth = 0;
  #brickHeight = 0;
  #brickXOffset = 0;
  #brickYOffset = 0;

  /** @type {HTMLImageElement | null} */
  #image = null;

  /** @type {Brick[]} */
  bricks = [];

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
   * @param {object} opts
   * @param {string} opts.imagePath - image URL
   * @param {number} opts.levelWidth as units of `brickWidth`
   * @param {number} opts.levelHeight as units of `brickHeight`
   * @param {number} opts.brickWidth
   * @param {number} opts.brickHeight
   * @param {number} opts.brickXOffset
   * @param {number} opts.brickYOffset
   */
  async loadLevels(opts) {
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
   * @param {number} num Level number
   */
  changeLevel(num) {
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

/**
 * Generate Brick array based on level data
 * @param {object} opts
 * @param {HTMLImageElement} opts.image
 * @param {number} opts.num
 * @param {number} opts.levelWidth
 * @param {number} opts.levelHeight
 * @param {number} opts.brickWidth
 * @param {number} opts.brickHeight
 * @param {number} opts.brickXOffset
 * @param {number} opts.brickYOffset
 */
export const generateBricks = (opts) => {
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
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

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

  /** @type {Brick[]} */
  const bricks = [];

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
