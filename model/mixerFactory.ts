import Mixer from './mixer';
import BehringerX32 from './behringerX32';
import DummyMixer from './dummyMixer';

class MixerFactory {
  public static createMixer(mixerType: string, ip: string): Mixer {
    switch (mixerType) {
      case BehringerX32.mixerName:
        return new BehringerX32(ip);
      default:
        return new DummyMixer(ip);
    }
  }
}

export default MixerFactory;
