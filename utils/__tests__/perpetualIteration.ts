import { perpetuallyIterateOverArray } from '../perpetualIteration';

describe('Perpetual Iteration', () => {
  test('should yield undefined for empty array', () => {
    const iterator = perpetuallyIterateOverArray([]);
    expect(iterator.next().value).toBe(undefined);
    expect(iterator.next().value).toBe(undefined);
  });

  test('should yield array elements repeatedly', () => {
    const iterator = perpetuallyIterateOverArray([1, 2, 3]);
    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
    expect(iterator.next().value).toBe(3);
    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
    expect(iterator.next().value).toBe(3);
  });
});
