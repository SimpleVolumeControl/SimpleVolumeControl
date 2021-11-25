import InputData from './inputData';
import MixData from './mixData';

abstract class Mixer {
  abstract getInputData(mixId: string, inputId: string): InputData;
  abstract getMixData(id: string): MixData;
  abstract subscribeToChange(func: () => void): void;
  abstract subscribeToMeter(func: () => void): void;
}

export default Mixer;
