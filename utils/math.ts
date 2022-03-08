/**
 * Ensure that a value is in a given range.
 *
 * @param value The value that should be clamped.
 * @param min The lower bound of the range.
 * @param max The upper bound of the range.
 */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
