import Config from './config';
import MixerFactory from './mixerFactory';
import Mixer from './mixer';

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
    this.mixer = new MixerFactory(this.config.mixerType).createMixer();
  }

  public getMixer() {
    return this.mixer;
  }
}

export default App;
