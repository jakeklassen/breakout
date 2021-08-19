import {
  addComponent,
  addEntity,
  createWorld,
  defineComponent,
  defineQuery,
  defineSystem,
  pipe,
  Types,
} from "bitecs";

interface Viewport {
  width: number;
  height: number;
}

declare module "bitecs" {
  interface IWorld {
    dt: number;
    viewport: Viewport;
    context: CanvasRenderingContext2D;
  }
}

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
const ctx = canvas.getContext("2d")!;

let dt = 0;
let last = performance.now();

// create the world
const world = createWorld();

world.dt = 0;
world.viewport = {
  width: canvas.width,
  height: canvas.height,
};
world.context = ctx;
// Components

const Vector2 = { x: Types.f32, y: Types.f32 };
const ColorStruct = {
  r: Types.ui8,
  g: Types.ui8,
  b: Types.ui8,
  a: Types.ui8,
};
const RectangleStruct = {
  width: Types.f32,
  height: Types.f32,
};

const Position = defineComponent(Vector2);
const Color = defineComponent(ColorStruct);
const Velocity = defineComponent(Vector2);
const Rectangle = defineComponent(RectangleStruct);

const getRandom = (max: number, min = 0) =>
  Math.floor(Math.random() * max) + min;

// attach components
for (let i = 0; i < 100; ++i) {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, Color, eid);
  addComponent(world, Rectangle, eid);

  Position.x[eid] = getRandom(canvas.width);
  Position.y[eid] = getRandom(canvas.height);

  Velocity.x[eid] = getRandom(100, 20);
  Velocity.y[eid] = getRandom(100, 20);

  Color.r[eid] = getRandom(255, 0);
  Color.g[eid] = getRandom(255, 0);
  Color.b[eid] = getRandom(255, 0);
  Color.a[eid] = 1;

  Rectangle.width[eid] = getRandom(20, 10);
  Rectangle.height[eid] = getRandom(20, 10);
}

// SYSTEMS

const physicsQuery = defineQuery([Position, Velocity, Rectangle]);
const physicsSystem = defineSystem((world) => {
  const entities = physicsQuery(world);

  for (const entityId of entities) {
    Position.x[entityId] += Velocity.x[entityId] * dt;
    Position.y[entityId] += Velocity.y[entityId] * dt;

    if (
      Position.x[entityId] + Rectangle.width[entityId] >
      world.viewport.width
    ) {
      // Snap collider back into viewport
      Position.x[entityId] = world.viewport.width - Rectangle.width[entityId];
      Velocity.x[entityId] = -Velocity.x[entityId];
    } else if (Position.x[entityId] < 0) {
      Position.x[entityId] = 0;
      Velocity.x[entityId] = -Velocity.x[entityId];
    }

    if (
      Position.y[entityId] + Rectangle.height[entityId] >
      world.viewport.height
    ) {
      Position.y[entityId] = world.viewport.height - Rectangle.height[entityId];
      Velocity.y[entityId] = -Velocity.y[entityId];
    } else if (Position.y[entityId] < 0) {
      Position.y[entityId] = 0;
      Velocity.y[entityId] = -Velocity.y[entityId];
    }
  }

  return world;
});

const renderQuery = defineQuery([Position, Color, Rectangle]);
const renderSystem = defineSystem((world) => {
  world.context.clearRect(0, 0, world.viewport.width, world.viewport.height);
  const entities = renderQuery(world);
  for (const entityId of entities) {
    world.context.fillStyle = `rgba(${Color.r[entityId]},${Color.g[entityId]},${Color.b[entityId]},${Color.a[entityId]})`;
    world.context.fillRect(
      Position.x[entityId],
      Position.y[entityId],
      Rectangle.width[entityId],
      Rectangle.height[entityId],
    );
  }
  return world;
});

const pipeline = pipe(physicsSystem, renderSystem);

/**
 * The game loop.
 */
function frame(hrt: DOMHighResTimeStamp) {
  // How much time has elapsed since the last frame?
  // Also convert to seconds.
  dt = (hrt - last) / 1000;

  world.dt = dt;

  pipeline(world);

  last = hrt;

  // Keep the game loop going forever
  requestAnimationFrame(frame);
}

// we need to start the game
requestAnimationFrame(frame);
