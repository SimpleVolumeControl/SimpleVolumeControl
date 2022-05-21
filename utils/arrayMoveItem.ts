export const arrayMoveItemUp = <T>(array: T[], index: number): T[] => {
  const result = [...array];
  if (index > 0 && index < array.length) {
    [result[index], result[index - 1]] = [array[index - 1], array[index]];
  }
  return result;
};

export const arrayMoveItemDown = <T>(array: T[], index: number): T[] => {
  const result = [...array];
  if (index >= 0 && index < array.length - 1) {
    [result[index], result[index + 1]] = [array[index + 1], array[index]];
  }
  return result;
};
