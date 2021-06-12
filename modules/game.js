import { PLAYER_STARTING_LIVES } from "./constants.js";
import { LevelManager } from "./level-manager.js";

export class Game {
  playerLives = PLAYER_STARTING_LIVES;
  score = 0;

  level = {
    current: 0,
  };

  /**
   * @type {keyof Game.State}
   */
  state = Game.State.Playing;

  /**
   * @param {LevelManager} levelManger
   */
  constructor(levelManger) {
    this.levelManager = levelManger;
  }

  reset() {
    this.state = Game.State.Playing;
    this.score = 0;
    this.playerLives = PLAYER_STARTING_LIVES;
    this.levelManager.changeLevel(1);
  }

  static State = {
    Playing: /** @type {'Playing'} */ ("Playing"),
    GameOver: /** @type {'GameOver'} */ ("GameOver"),
    GameWon: /** @type {'GameWon'} */ ("GameWon"),
  };
}
