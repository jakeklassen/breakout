import levelsImageUrl from "../assets/levels.png";
import {
  aabbBottom,
  aabbLeft,
  aabbRight,
  aabbTop,
  intersects,
} from "./collision";
import {
  BRICK_HEIGHT_PX,
  BRICK_PADDING_SIDE_PX,
  BRICK_PADDING_TOP_PX,
  BRICK_SCORE,
  BRICK_WIDTH_PX,
  LEVEL_HEIGHT_UNITS,
  LEVEL_WIDTH_UNITS,
  TITLE_BAR_HEIGHT_PX,
} from "./constants";
import { Ball } from "./entities/ball";
import { Paddle } from "./entities/paddle";
import { Game } from "./game";
import { LevelManager } from "./level-manager";
import { clamp } from "./math";

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
const ctx = canvas.getContext("2d")!;

/**
 * Track the mouse
 */
const mouse = {
  position: { x: 0, y: 0 },
};

const game = new Game(new LevelManager());

const paddle = new Paddle({
  // Center in X and 32 pixel offset from the bottom of the canvas
  position: { x: canvas.width / 2 - 104 / 2, y: canvas.height - 32 },
  width: 104,
  height: 16,
});

const ball = new Ball({
  width: 12,
  height: 12,
  position: { x: 100, y: 100 },
  // Pixels per second
  velocity: { x: 0, y: -300 },
  maxVelocity: { x: 100, y: 600 },
  paddleBounceFactor: { x: 250, y: 0 },
  brickCollisionSpeedBoost: { x: 0, y: 10 },
});

let dt = 0;
let last = performance.now();

/**
 * The game loop.
 */
function frame(hrt: DOMHighResTimeStamp) {
  // How much time has elapsed since the last frame?
  // Also convert to seconds.
  dt = (hrt - last) / 1000;

  let ballPaddleCollisionHandled = false;
  let ballBrickCollisionHandled = false;

  // Position paddle based on mouse
  paddle.position.x = mouse.position.x;

  if (ball.state === Ball.State.OnPaddle) {
    ball.position.x = paddle.center.x - ball.width / 2;
    ball.position.y = aabbTop(paddle) - ball.height;
  }

  if (ball.state === Ball.State.Free) {
    // Move and handle ball collisions in X axis
    ball.position.x += ball.velocity.x * dt;
  }

  if (intersects(ball, paddle)) {
    // We know we've collided in X, but what side of the paddle are we closest to?
    const closestSide =
      Math.abs(aabbRight(paddle) - aabbLeft(ball)) <
      Math.abs(aabbLeft(paddle) - aabbRight(ball))
        ? "right"
        : "left";

    // Are we moving to the left or right?
    if (ball.velocity.x > 0) {
      if (closestSide === "right") {
        ball.position.x = aabbRight(paddle);
      } else {
        ball.position.x = aabbLeft(paddle) - ball.width;
        ball.velocity.x = -ball.velocity.x;
      }
    } else if (ball.velocity.x < 0) {
      if (closestSide === "left") {
        ball.position.x = aabbLeft(paddle) - ball.width;
      } else {
        ball.position.x = aabbRight(paddle);
        ball.velocity.x = -ball.velocity.x;
      }
    }
  }

  // Handle brick collisions in X axis
  for (const brick of game.levelManager.bricks) {
    if (brick.visible === false) continue;

    if (intersects(ball, brick)) {
      ballBrickCollisionHandled = true;
      brick.visible = false;
      game.score += BRICK_SCORE;

      if (ball.velocity.x > 0) {
        ball.position.x = brick.position.x - ball.width;
      } else if (ball.velocity.x < 0) {
        ball.position.x = aabbRight(brick);
      }

      ball.velocity.x = -ball.velocity.x;
    }
  }

  if (ball.state === Ball.State.Free) {
    // Move and handle ball collisions in Y axis
    ball.position.y += ball.velocity.y * dt;
  }

  // Only process collisions in the Y axis if we haven't already
  // detected and handled collision in the X axis.
  if (!ballPaddleCollisionHandled && intersects(ball, paddle)) {
    ballPaddleCollisionHandled = true;
    ball.position.y = aabbTop(paddle) - ball.height;

    ball.velocity.y +=
      Math.sign(ball.velocity.y) * ball.brickCollisionSpeedBoost.y;
    ball.velocity.y =
      clamp(
        Math.abs(ball.velocity.y),
        Math.abs(ball.velocity.y),
        Math.abs(ball.maxVelocity.y)
      ) * Math.sign(ball.velocity.y);
    ball.velocity.y = -ball.velocity.y;

    const half = paddle.width / 2;
    // How far from the center of the paddle is the ball?
    // The further from the center, the steeper the bounce.
    const difference = paddle.center.x - ball.position.x - ball.width / 2;
    // At this point difference is between 0..half, but we need this
    // as a percentage from 0..1.
    const factor = Math.abs(difference) / half;
    // We'll flip the sign of difference and multiply by our target
    // bounce velocity and factor. This gives us "control" of the ball.
    ball.velocity.x =
      Math.sign(-difference) * ball.paddleBounceFactor.x * factor;
  }

  if (!ballBrickCollisionHandled) {
    // Handle brick collisions in Y axis
    for (const brick of game.levelManager.bricks) {
      if (brick.visible === false) continue;

      if (intersects(ball, brick)) {
        brick.visible = false;
        game.score += BRICK_SCORE;

        if (ball.velocity.y > 0) {
          ball.position.y = brick.position.y - ball.height;
        } else if (ball.velocity.y < 0) {
          ball.position.y = aabbBottom(brick);
        }

        ball.velocity.y = -ball.velocity.y;
      }
    }
  }

  if (aabbRight(ball) > canvas.width) {
    ball.position.x = canvas.width - ball.width;
    ball.velocity.x = -ball.velocity.x;
  } else if (aabbLeft(ball) < 0) {
    ball.position.x = 0;
    ball.velocity.x = -ball.velocity.x;
  }

  if (aabbBottom(ball) > canvas.height) {
    ball.state = Ball.State.OnPaddle;
    ball.position.y = canvas.height - ball.height;
    ball.velocity.x = 0;
    ball.velocity.y = -ball.velocity.y;

    game.playerLives--;
    if (game.playerLives <= 0) {
      game.state = Game.State.GameOver;
    }
  } else if (aabbTop(ball) < TITLE_BAR_HEIGHT_PX) {
    ball.position.y = TITLE_BAR_HEIGHT_PX;
    ball.velocity.y = -ball.velocity.y;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw title bar
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillRect(0, 0, canvas.width, TITLE_BAR_HEIGHT_PX);

  ctx.fillStyle = "white";
  ctx.font = "16px serif";
  ctx.textAlign = "center";
  ctx.fillText(`Level: ${game.level.current}`, canvas.width / 2, 18);
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${game.score}`, 16, 18);
  ctx.textAlign = "right";
  ctx.fillText(`Lives: ${game.playerLives}`, canvas.width - 16, 18);

  if (game.state === Game.State.Playing) {
    // Draw entities
    ctx.fillStyle = "white";
    ctx.fillRect(
      paddle.position.x,
      paddle.position.y,
      paddle.width,
      paddle.height
    );
    ctx.fillRect(ball.position.x, ball.position.y, ball.width, ball.height);

    for (const brick of game.levelManager.bricks) {
      if (brick.visible === false) continue;

      ctx.fillStyle = brick.rgba;
      ctx.fillRect(
        brick.position.x,
        brick.position.y,
        brick.width,
        brick.height
      );
    }
  } else if (game.state === Game.State.GameOver) {
    ctx.textAlign = "center";

    ctx.fillText(
      "Game Over... Click to Restart",
      canvas.width / 2,
      canvas.height / 2
    );
  } else if (game.state === Game.State.GameWon) {
    ctx.textAlign = "center";

    const lines = [
      "You Won!",
      `Your Score Was ${game.score}`,
      "Click to Restart",
    ];

    for (const [idx, line] of lines.entries()) {
      ctx.fillText(line, canvas.width / 2, canvas.height / 2 + idx * 18);
    }
  }

  if (game.levelManager.isCurrentLevelWon) {
    if (game.levelManager.hasNextLevel) {
      game.levelManager.gotoNextLevel();
      ball.reset();
    } else {
      game.state = Game.State.GameWon;
    }
  }

  last = hrt;

  requestAnimationFrame(frame);
}

function mouseMoveHandler(e: MouseEvent) {
  // `movementX` is a relative position. It's the change in position only, so
  // we need to add it to the mouse position.
  mouse.position.x += e.movementX;

  // While we're at it, let's clamp the mouse to the canvas.
  // We need to subtract the width of the paddle as well to get proper clamping.
  mouse.position.x = clamp(mouse.position.x, 0, canvas.width - paddle.width);
}

function pointerLockChange() {
  // We'll subscribe to mousemove events if the canvas is the active pointerLockElement
  if (document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", mouseMoveHandler, false);
  } else {
    document.removeEventListener("mousemove", mouseMoveHandler, false);
  }
}

// On click, request pointer lock
canvas.addEventListener(
  "click",
  () => {
    canvas.requestPointerLock();

    if (document.pointerLockElement === canvas) {
      if (
        game.state === Game.State.GameOver ||
        game.state === Game.State.GameWon
      ) {
        ball.state = Ball.State.OnPaddle;
        game.reset();
        ball.reset();
      } else if (ball.state === Ball.State.OnPaddle) {
        ball.state = Ball.State.Free;
      }
    }
  },
  false
);

document.addEventListener("pointerlockchange", pointerLockChange, false);

game.levelManager
  .loadLevels({
    imagePath: levelsImageUrl,
    levelWidth: LEVEL_WIDTH_UNITS,
    levelHeight: LEVEL_HEIGHT_UNITS,
    brickWidth: BRICK_WIDTH_PX,
    brickHeight: BRICK_HEIGHT_PX,
    brickXOffset: BRICK_PADDING_SIDE_PX,
    brickYOffset: BRICK_PADDING_TOP_PX,
  })
  .then((levelManager) => {
    levelManager.changeLevel(1);

    // Kick off the game loop!
    requestAnimationFrame(frame);
  })
  .catch((error) => {
    console.error("❌ Error loading levels image", error);
  });
