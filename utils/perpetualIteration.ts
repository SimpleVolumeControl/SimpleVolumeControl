/**
 * Perpetually yield the elements of an array.
 * When the end of the array is reached,
 * it will start again from the beginning.
 * If the array is empty, undefined will be yielded.
 *
 * @param array The array over which will be iterated.
 */
export function* perpetuallyIterateOverArray<T>(array: T[]) {
  let idx = 0;
  while (true) {
    yield array[idx];
    idx = (idx + 1) % array.length;
  }
}
