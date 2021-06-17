import { PLAYER_STARTING_LIVES } from "./constants";
import { LevelManager } from "./level-manager";
import { ValueOf } from "./type-utils";

export class Game {
  static State = {
    Playing: "Playing",
    GameOver: "GameOver",
    GameWon: "GameWon",
  } as const;

  playerLives = PLAYER_STARTING_LIVES;
  score = 0;

  level = {
    current: 0,
  };

  state: ValueOf<typeof Game.State> = Game.State.Playing;

  constructor(public levelManager: LevelManager) {}

  reset() {
    this.state = Game.State.Playing;
    this.score = 0;
    this.playerLives = PLAYER_STARTING_LIVES;
    this.levelManager.changeLevel(1);
  }
}
