import Mixer from './mixer';
import BehringerX32 from './behringerX32';
import mixerData from './mixers.json';

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

  public getInputs(): string[] {
    return (mixerData[this.mixerType] ?? mixerData['Behringer X32']).inputs;
  }

  public getMixes(): string[] {
    return (mixerData[this.mixerType] ?? mixerData['Behringer X32']).mixes;
  }
}

export default MixerFactory;
