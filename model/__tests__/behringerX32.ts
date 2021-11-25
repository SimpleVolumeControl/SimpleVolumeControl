import BehringerX32 from '../behringerX32';

describe('BehringerX32', () => {
  test('should return valid input information with a level of 0', () => {
    expect(new BehringerX32().getInputData('bus01', 'ch01').level).toBe(0);
  });
  test('should return valid input information with a muted state', () => {
    expect(new BehringerX32().getInputData('bus01', 'ch01').mute).toBe(true);
  });
  test('should return valid mix information with a level of 0', () => {
    expect(new BehringerX32().getMixData('bus01').level).toBe(0);
  });
  test('should return valid mix information with a muted state', () => {
    expect(new BehringerX32().getMixData('bus01').mute).toBe(true);
  });
});
