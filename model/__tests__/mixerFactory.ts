import MixerFactory from '../mixerFactory';
import BehringerX32 from '../behringerX32';

describe('MixerFactory', () => {
  test('should create a BehringerX32 mixer', () => {
    const factory = new MixerFactory('Behringer X32');
    expect(factory.createMixer()).toBeInstanceOf(BehringerX32);
  });
});
