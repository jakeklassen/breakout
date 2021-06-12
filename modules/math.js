/**
 * Clamp `value` to `min` and `max`
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
