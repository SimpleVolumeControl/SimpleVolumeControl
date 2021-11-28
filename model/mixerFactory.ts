import Mixer from './mixer';
import BehringerX32 from './behringerX32';

export const mixerData: {
  [mixer: string]: { inputs: string[]; mixes: string[] };
} = {
  // prettier-ignore
  'Behringer X32': {
    inputs: [
      'ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08',
      'ch09', 'ch10', 'ch11', 'ch12', 'ch13', 'ch14', 'ch15', 'ch16',
      'ch17', 'ch18', 'ch19', 'ch20', 'ch21', 'ch22', 'ch23', 'ch24',
      'ch25', 'ch26', 'ch27', 'ch28', 'ch29', 'ch30', 'ch31', 'ch32',
      'aux01', 'aux02', 'aux03', 'aux04', 'aux05', 'aux06',
      'fx01', 'fx02', 'fx03', 'fx04', 'fx05', 'fx06', 'fx07', 'fx08',
    ],
    mixes: [
      'bus01', 'bus02', 'bus03', 'bus04', 'bus05', 'bus06', 'bus07', 'bus08',
      'bus09', 'bus10', 'bus11', 'bus12', 'bus13', 'bus14', 'bus15', 'bus16',
      'mc', 'lr',
    ],
  },
};

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
