import Mixer from './mixer';
import BehringerX32 from './behringerX32';
import DummyMixer from './dummyMixer';

/**
 * A factory that can be used to create concrete mixers.
 */
class MixerFactory {
  /**
   * Creates a new mixer according to the given type.
   * Will create a DummyMixer as fallback.
   *
   * @param mixerType The identifier of the mixer type.
   * @param ip The IP address of the mixer.
   */
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
