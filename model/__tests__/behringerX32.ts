import BehringerX32 from '../behringerX32';

describe('BehringerX32', () => {
  test('should return valid input information with a level of 0 (muted)', () => {
    const mixer = new BehringerX32('127.0.0.1');
    const inputData = mixer.getInputData('bus-01', 'ch-01');
    mixer.stop();
    expect(inputData.level).toBe(0);
    expect(inputData.mute).toBe(true);
  });

  test('should return valid mix information with a level of 0 (muted)', () => {
    const mixer = new BehringerX32('127.0.0.1');
    const mixData = mixer.getMixData('bus-01');
    mixer.stop();
    expect(mixData.level).toBe(0);
    expect(mixData.mute).toBe(true);
  });

  test('should update IP address', () => {
    const mixer = new BehringerX32('127.0.0.1');
    expect(mixer.ip).toBe('127.0.0.1');
    mixer.setIp('192.168.0.1');
    expect(mixer.ip).toBe('192.168.0.1');
    mixer.stop();
  });
});
