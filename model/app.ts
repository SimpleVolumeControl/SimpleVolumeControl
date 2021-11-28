import Config from './config';
import MixerFactory from './mixerFactory';
import Mixer from './mixer';
import MixData from './mixData';
import InputData from './inputData';

class App {
  private static instance: App;
  private config: Config;
  private mixer: Mixer;

  static initialize() {
    this.instance = new App();
  }

  static getInstance() {
    if (!this.instance) {
      App.initialize();
    }
    return this.instance;
  }

  private constructor() {
    this.config = new Config();
    this.mixer = new MixerFactory(this.config.mixer).createMixer();
    this.refreshConfig();
  }

  public loadConfig(filename: string) {
    this.config.readFromFile(filename);
    this.refreshConfig();
  }

  public saveConfig(filename: string) {
    this.config.saveToFile(filename);
  }

  public getMixes(): MixData[] {
    return this.config.mixes.map((mixAssignment) =>
      this.mixer.getMixData(mixAssignment.mix),
    );
  }

  public getMix(id: string): MixData {
    return this.mixer.getMixData(id);
  }

  public getInputs(id: string): InputData[] {
    const inputs =
      this.config.mixes.find((mixAssignment) => mixAssignment.mix === id)
        ?.inputs ?? [];
    return inputs.map((input) => this.mixer.getInputData(id, input));
  }

  public subscribeToChange(func: () => void) {}

  public subscribeToMeter(func: () => void) {}

  public setLevel(level: number, mix: string, input: string | null) {}

  public setMute(state: boolean, mix: string, input: string | null) {}

  private refreshConfig() {
    this.mixer = new MixerFactory(this.config.mixer).createMixer();
  }
}

export default App;
