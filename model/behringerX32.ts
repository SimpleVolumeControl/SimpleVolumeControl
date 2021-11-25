import Mixer from './mixer';
import InputData from './inputData';
import MixData from './mixData';

class BehringerX32 extends Mixer {
  getInputData(mixId: string, inputId: string): InputData {
    return {
      id: inputId,
      name: inputId.toUpperCase(),
      color: 'red',
      level: 0,
      mute: true,
    };
  }

  getMixData(id: string): MixData {
    return {
      id: id,
      name: id.toUpperCase(),
      color: 'red',
      level: 0,
      mute: true,
    };
  }

  subscribeToChange(func: () => void): void {}

  subscribeToMeter(func: () => void): void {}
}

export default BehringerX32;
