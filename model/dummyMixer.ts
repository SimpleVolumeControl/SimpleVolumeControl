import InputData from './inputData';
import MixData from './mixData';
import Mixer from './mixer';
import MixerUpdateCallbacks from './mixerUpdateCallbacks';

class DummyMixer extends Mixer {
  static readonly mixerName = 'Dummy Mixer';

  constructor(ip: string) {
    super(ip);
  }
  getInputData(mixId: string, inputId: string): InputData | null {
    return null;
  }

  stop() {}

  getMixData(id: string): MixData | null {
    return null;
  }

  registerListeners(callbacks: MixerUpdateCallbacks): void {}
  unregisterListeners(callbacks: MixerUpdateCallbacks): void {}

  getMixerName(): string {
    return DummyMixer.mixerName;
  }
}

export default DummyMixer;
