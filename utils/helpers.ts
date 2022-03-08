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

/**
 * A helper function to check for the array type without introducing the any type.
 * `Array.isArray` narrows down to any[] by default, which can be undesired.
 *
 * @param value The value to be checked.
 */
export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);

/**
 * A helper function to check if a value is a record.
 * Can be used to distinguish "proper" record objects from arrays and null.
 *
 * @param value The value to be checked.
 */
export const isRecord = (
  value: unknown,
): value is Record<string | number | symbol, unknown> =>
  isObject(value) && !Array.isArray(value) && value !== null;

/**
 * Make sure that a record is returned.
 * If the provided value is already a record, it will be returned,
 * otherwise an empty record will be returned.
 *
 * @param value The value that is returned if it is a record.
 */
export const ensureRecord = (
  value: unknown,
): Record<string | number | symbol, unknown> => (isRecord(value) ? value : {});

/**
 * Try to parse JSON data and return a fallback value in case of failure.
 *
 * @param data The JSON data to be parsed.
 * @param fallback The fallback value that is returned in case of an error.
 */
export const tryJsonParse = (data: string, fallback: unknown): unknown => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
};

/**
 * Helper function to exclude the null type.
 *
 * @param value The value to be checked.
 */
export const notNull = <T>(value: T | null): value is T => value !== null;
