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

  last = hrt;

  renderWorldItems(world, ctx);
  // Keep the game loop going forever
  requestAnimationFrame(frame);
}

// create the world
const world = new World();
const redSquare = new Entity();
redSquare.addComponent(new Position());
redSquare.addComponent(new Dimensions());
redSquare.addComponent(new Color());
redSquare.addComponent(new Shape());

world.addWorldItem({
  id: 1,
  position: { x: 0, y: 0 },
  dimensions: { width: 100, height: 100 },
  color: "red",
  shape: "rect",
});

// register our entities and their components
// red square, with a position and velocity

// we need to start the game
requestAnimationFrame(frame);
