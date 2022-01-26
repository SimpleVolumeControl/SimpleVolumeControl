import InputData from './inputData';
import MixData from './mixData';
import MixerUpdateCallbacks from './mixerUpdateCallbacks';

abstract class Mixer {
  protected _ip: string;

  protected constructor(ip: string) {
    this._ip = ip;
  }

  get ip() {
    return this._ip;
  }

  private set ip(ip) {
    this._ip = ip;
  }

  public setIp(ip: string) {
    this.ip = ip;
  }

  abstract stop(): void;

  abstract getInputData(mixId: string, inputId: string): InputData | null;
  abstract getMixData(id: string): MixData | null;

  abstract getMetersString(ids: string[]): string;

  abstract registerListeners(callbacks: MixerUpdateCallbacks): void;
  abstract unregisterListeners(callbacks: MixerUpdateCallbacks): void;

  abstract getMixerName(): string;

  abstract setLevel(level: number, mix: string, input: string | null): void;
  abstract setMute(state: boolean, mix: string, input: string | null): void;
}

export default Mixer;
