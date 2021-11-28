/**
 * A helper function to narrow types down to objects properly.
 *
 * The builtin narrowing by using `typeof value === 'object'` as a type guard directly
 * doesn't work properly, as it narrows to `{} | null`, which is too constrained.
 *
 * See the following issue:
 * https://github.com/microsoft/TypeScript/issues/38801
 *
 * @param value The value of unknown type which should be tested for being an object.
 */
export const isObject = (
  value: unknown,
): value is Record<string | number | symbol, unknown> | null | unknown[] =>
  typeof value === 'object';

export const ensureRecord = (
  value: unknown,
): Record<string | number | symbol, unknown> => {
  if (isObject(value) && !Array.isArray(value) && value !== null) {
    return value;
  }
  return {};
};
