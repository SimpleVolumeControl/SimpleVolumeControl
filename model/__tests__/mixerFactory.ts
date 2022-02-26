import MixerFactory from '../mixerFactory';
import BehringerX32 from '../behringerX32';

describe('MixerFactory', () => {
  test('should create a Behringer X32 mixer', () => {
    const mixer = MixerFactory.createMixer('Behringer X32', '127.0.0.1');
    expect(mixer).toBeInstanceOf(BehringerX32);
    mixer.stop();
  });
});
