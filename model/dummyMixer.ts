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

  getMetersString(ids: string[]) {
    return ids.map(() => 'A').join('');
  }

  registerListeners(callbacks: MixerUpdateCallbacks): void {}
  unregisterListeners(callbacks: MixerUpdateCallbacks): void {}

  getMixerName(): string {
    return DummyMixer.mixerName;
  }

  setLevel(level: number, mix: string, input: string | null): void {}
  setMute(state: boolean, mix: string, input: string | null): void {}
}

export default DummyMixer;