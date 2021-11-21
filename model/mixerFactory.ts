import Mixer from './mixer';
import BehringerX32 from './behringerX32';

class MixerFactory {
  private readonly mixerType: string;

  public constructor(mixerType: string) {
    this.mixerType = mixerType;
  }

  public createMixer(): Mixer {
    switch (this.mixerType) {
      default:
        return new BehringerX32();
    }
  }
}

export default MixerFactory;
