import MixerFactory from '../mixerFactory';
import BehringerX32 from '../behringerX32';

describe('MixerFactory', () => {
  test('should create a Behringer X32 mixer', () => {
    const factory = new MixerFactory('Behringer X32');
    const mixer = factory.createMixer('127.0.0.1');
    expect(mixer).toBeInstanceOf(BehringerX32);
    mixer.stop();
  });
});
