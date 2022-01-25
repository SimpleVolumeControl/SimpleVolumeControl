import { isInputData } from '../inputData';

describe('isInputData', () => {
  test('should accept valid InputData', () => {
    const inputData = {
      id: 'ch-01',
      name: 'CH01',
      color: 'red',
      level: 0,
      mute: true,
    };
    expect(isInputData(inputData)).toBe(true);
  });

  test('should reject wrong base types', () => {
    const inputData = 'foobar';
    expect(isInputData(inputData)).toBe(false);
  });

  test('should reject arrays', () => {
    const inputData: unknown = [];
    expect(isInputData(inputData)).toBe(false);
  });

  test('should reject null', () => {
    const inputData = null;
    expect(isInputData(inputData)).toBe(false);
  });

  test('should reject empty objects', () => {
    const inputData = {};
    expect(isInputData(inputData)).toBe(false);
  });

  test('should reject objects with missing keys', () => {
    const inputData = {
      id: 'ch-01',
      name: 'CH01',
      color: 'red',
      mute: true,
    };
    expect(isInputData(inputData)).toBe(false);
  });

  test('should reject objects with wrong data types', () => {
    const inputData = {
      id: 1,
      name: 'CH01',
      color: 'red',
      level: 0,
      mute: true,
    };
    expect(isInputData(inputData)).toBe(false);
  });
});
