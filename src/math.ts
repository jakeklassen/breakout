/**
 * Clamp `value` to `min` and `max`
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
