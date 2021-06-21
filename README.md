# Breakout

Breakout in JS/Canvas

[Demo](https://breakout-js.netlify.app/) 🎮

## ECS Definition

| EntityId | Position | Color  | Component N ... |
| -------- | -------- | ------ | --------------- |
| 1        | {x, y}   | 'red'  |
| 2        | {x, y}   | 'blue' |

- Database table analogy
- Entity = number
- Need a way to create an entity
- Need something to hold components
- Need some way to get an entities component
- Need something to hold all our entities and their components
- Need something to run all our "game logic" (Systems)
  - Systems are functions that operate on one or more entities with components of interest

System: A way to query for components and update them

## High Level Objective

Move a colored square around the screen with collisions, using an ECS.
