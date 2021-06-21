import World from "./world";

// What about testing?
// What about DI?
// What  about a shared interface?
function renderWorldItems(world: World, ctx: CanvasRenderingContext2D) {
  // clear screen

  // TODO: If I'm talking to a DB, and I am very context sensitive
  const worldItems = world.getWorldItems();
  worldItems.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.fillRect(
      item.position.x,
      item.position.y,
      item.dimensions.width,
      item.dimensions.height,
    );
  });
}

export default renderWorldItems;
