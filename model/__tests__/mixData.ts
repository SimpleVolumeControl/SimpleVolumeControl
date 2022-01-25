import { isMixData } from '../mixData';

describe('isMixData', () => {
  test('should accept valid MixData', () => {
    const mixData = {
      id: 'bus-01',
      name: 'BUS01',
      color: 'red',
      level: 0,
      mute: true,
    };
    expect(isMixData(mixData)).toBe(true);
  });

  test('should reject wrong base types', () => {
    const mixData = 'foobar';
    expect(isMixData(mixData)).toBe(false);
  });

  test('should reject arrays', () => {
    const mixData: unknown = [];
    expect(isMixData(mixData)).toBe(false);
  });

  test('should reject null', () => {
    const mixData = null;
    expect(isMixData(mixData)).toBe(false);
  });

  test('should reject empty objects', () => {
    const mixData = {};
    expect(isMixData(mixData)).toBe(false);
  });

  test('should reject objects with missing keys', () => {
    const mixData = {
      id: 'bus-01',
      name: 'BUS01',
      color: 'red',
      mute: true,
    };
    expect(isMixData(mixData)).toBe(false);
  });

  test('should reject objects with wrong data types', () => {
    const mixData = {
      id: 1,
      name: 'BUS01',
      color: 'red',
      level: 0,
      mute: true,
    };
    expect(isMixData(mixData)).toBe(false);
  });
});
