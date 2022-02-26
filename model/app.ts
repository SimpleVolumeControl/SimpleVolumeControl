import Config from './config';
import MixerFactory from './mixerFactory';
import Mixer from './mixer';
import MixData from './mixData';
import InputData from './inputData';
import { notNull } from '../utils/helpers';
import DummyMixer from './dummyMixer';
import MixerUpdateCallbacks from './mixerUpdateCallbacks';
import * as crypto from 'crypto';

class App {
  private static instance: App;
  private config: Config;
  private mixer: Mixer;

  static getInstance() {
    if (!this.instance) {
      this.instance = new App();
    }
    return this.instance;
  }

  private constructor() {
    this.config = new Config();
    this.mixer = new DummyMixer('127.0.0.1');
  }

  public loadConfig(filename: string) {
    this.config.readFromFile(filename);
    this.refreshConfig();
  }

  public saveConfig(filename: string) {
    this.config.saveToFile(filename);
  }

  public getMixes(): MixData[] {
    return this.config.mixes
      .map((mixAssignment) => this.mixer.getMixData(mixAssignment.mix))
      .filter(notNull);
  }

  public getMix(id: string): MixData | null {
    return this.mixer.getMixData(id);
  }

  public getInputs(id: string): InputData[] {
    const inputs =
      this.config.mixes.find((mixAssignment) => mixAssignment.mix === id)
        ?.inputs ?? [];
    return inputs
      .map((input) => this.mixer.getInputData(id, input))
      .filter(notNull);
  }

  public getInput(mixId: string, inputId: string): InputData | null {
    return this.mixer.getInputData(mixId, inputId);
  }

  public getConfiguredMixIds(): string[] {
    return this.config.mixes.map((mixAssignment) => mixAssignment.mix);
  }

  public getConfiguredInputIds(mix: string): string[] {
    return (
      this.config.mixes.find((mixAssignment) => mixAssignment.mix === mix)
        ?.inputs ?? []
    );
  }

  public getMetersString(ids: string[]): string {
    return this.mixer.getMetersString(ids);
  }

  public registerListeners(callbacks: MixerUpdateCallbacks): void {
    this.mixer.registerListeners(callbacks);
  }

  public unregisterListeners(callbacks: MixerUpdateCallbacks): void {
    this.mixer.unregisterListeners(callbacks);
  }

  public setLevel(level: number, mix: string, input: string | null) {
    this.mixer.setLevel(level, mix, input);
  }

  public setMute(state: boolean, mix: string, input: string | null) {
    this.mixer.setMute(state, mix, input);
  }

  public checkPassword(password: String): boolean {
    return (
      crypto
        .createHash('sha256')
        .update(this.config.password)
        .digest('base64') === password
    );
  }

  private refreshConfig() {
    if (this.config.mixer != this.mixer.getMixerName()) {
      this.mixer.stop();
      this.mixer = MixerFactory.createMixer(this.config.mixer, this.config.ip);
      // TODO Migrate registered listeners on mixer change
    }
    if (this.mixer.ip !== this.config.ip) {
      this.mixer.setIp(this.config.ip);
    }
  }
}

export default App;
