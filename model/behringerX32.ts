import Mixer from './mixer';

class BehringerX32 extends Mixer {
  getInputs(mix: string): string[] {
    return [];
  }

  getMixes(): string[] {
    return ['foo', 'bar'];
  }
}

export default BehringerX32;
