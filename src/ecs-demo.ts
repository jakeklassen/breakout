import renderWorldItems from "./ecs/rendering-system";
import World, { Color, Dimensions, Position, Shape } from "./ecs/world";

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
const ctx = canvas.getContext("2d")!;

let dt = 0;
let last = performance.now();

/**
 * The game loop.
 */
function frame(hrt: DOMHighResTimeStamp) {
  // How much time has elapsed since the last frame?
  // Also convert to seconds.
  dt = (hrt - last) / 1000;

  // we need to work with our systems
  world.updateSystems(dt);

  last = hrt;

  renderWorldItems(world, ctx);
  // Keep the game loop going forever
  requestAnimationFrame(frame);
}

// create the world
const world = new World();

// create red square
// attach components

// SYSTEMS

abstract class System {}

class MovementSystem extends System {
  update(world: World, dt: number) {
    for (const [entityId, componentMap] of world.view(Position, Dimensions)) {
      componentMap.get(Position).x;
      componentMap.get(Dimensions);
    }
  }
}

// Rendering system

// we need to start the game
requestAnimationFrame(frame);
