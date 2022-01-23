import Mixer from './mixer';
import BehringerX32 from './behringerX32';
import mixerData from './mixers.json';
import DummyMixer from './dummyMixer';

class MixerFactory {
  private readonly mixerType: string;

  public constructor(mixerType: string) {
    this.mixerType = mixerType;
  }

  public createMixer(ip: string): Mixer {
    switch (this.mixerType) {
      case BehringerX32.mixerName:
        return new BehringerX32(ip);
      default:
        return new DummyMixer(ip);
    }
  }

  public getInputs(): string[] {
    return mixerData[this.mixerType]?.inputs ?? [];
  }

  public getMixes(): string[] {
    return mixerData[this.mixerType]?.mixes ?? [];
  }

  public getMixerName(): string {
    return mixerData[this.mixerType] ? this.mixerType : DummyMixer.mixerName;
  }
}

export default MixerFactory;
