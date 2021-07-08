import { Color } from "./ecs/components/color";
import { Position } from "./ecs/components/position";
import { Rectangle } from "./ecs/components/rectangle";
import { Velocity } from "./ecs/components/velocity";
import { System } from "./ecs/system";
import World from "./ecs/world";

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

  // Keep the game loop going forever
  requestAnimationFrame(frame);
}

// create the world
const world = new World();

// create red square
const redSquare = world.createEntity();
// attach components
world.addEntityComponents(
  redSquare,
  new Position(),
  new Velocity(100, 200),
  new Color("red"),
  new Rectangle(12, 12),
);

// SYSTEMS

class MovementSystem extends System {
  update(world: World, dt: number) {
    for (const [, componentMap] of world.view(Position, Velocity)) {
      // Move the position by some velocity
      const position = componentMap.get(Position);
      const velocity = componentMap.get(Velocity);
      // TODO: continue movement system
    }
  }
}

// Rendering system
class RenderingSystem extends System {
  constructor(private readonly context: CanvasRenderingContext2D) {
    super();
  }

  public update(world: World, dt: number): void {
    for (const [, componentMap] of world.view(Position, Color, Rectangle)) {
      const { color } = componentMap.get(Color);
      const { width, height } = componentMap.get(Rectangle);
      const { x, y } = componentMap.get(Position);

      this.context.fillStyle = color;
      this.context.fillRect(x, y, width, height);
    }
  }
}

world.addSystems(new RenderingSystem(ctx));

// we need to start the game
requestAnimationFrame(frame);
