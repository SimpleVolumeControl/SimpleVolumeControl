import InputData from './inputData';
import MixData from './mixData';
import Mixer from './mixer';

/**
 * This is a minimal concrete implementation of Mixer.
 * It does nothing and is mainly intended for testing purposes and as a placeholder.
 */
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

  getMixerName(): string {
    return DummyMixer.mixerName;
  }

  setLevel(level: number, mix: string, input: string | null): void {}
  setMute(state: boolean, mix: string, input: string | null): void {}
}

export default DummyMixer;
