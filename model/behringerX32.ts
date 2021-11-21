import Mixer from './mixer';

class BehringerX32 extends Mixer {
  getInputs(mix: string): string[] {
    return [];
  }

  getMixes(): string[] {
    return ['bus01', 'bus02'];
  }
}

export default BehringerX32;
