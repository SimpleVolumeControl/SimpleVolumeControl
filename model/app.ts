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
    const mixAssignment =
      this.config.mixes.find((mixAssignment) => mixAssignment.mix === id)
        ?.inputs ?? [];
    return mixAssignment.map((input) => this.mixer.getInputData(id, input));
  }

  public subscribeToChange(func: () => void) {}

  public subscribeToMeter(func: () => void) {}

  public setLevel(level: number, mix: string, input: string | null) {}

  public setMute(state: boolean, mix: string, input: string | null) {}
}

export default App;
