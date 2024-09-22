import Config from './config';
import MixerFactory from './mixerFactory';
import Mixer from './mixer';
import MixData from './mixData';
import InputData from './inputData';
import { notNull } from '../utils/helpers';
import DummyMixer from './dummyMixer';
import MixerUpdateCallbacks from './mixerUpdateCallbacks';
import NullableConfig from './nullableConfig';

/**
 * App represents the whole application.
 * It is used as a facade controller to handle all system operations.
 * App is a Singleton (GoF:127).
 */
class App {
  /**
   * The single instance of App.
   */
  private static instance: App;

  /**
   * The currently used configuration.
   */
  private config: Config;

  /**
   * The currently used mixer.
   */
  private mixer: Mixer;

  private configChangeListeners: (() => void)[] = [];

  /**
   * Get access to the singleton instance.
   * If there is no instance yet, a new one will be created.
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new App();
    }
    return this.instance;
  }

  /**
   * Initializes App.
   * It sets up basic values for all necessary fields.
   */
  private constructor() {
    this.config = new Config();
    this.mixer = new DummyMixer('127.0.0.1');
  }

  /**
   * Read a configuration file and use its content as a configuration from now on.
   *
   * @param filename The path to the configuration file that is to be read.
   */
  public loadConfig(filename: string) {
    this.config.readFromFile(filename);
    this.refreshConfig();
  }

  /**
   * Save the currently used configuration to a file.
   *
   * @param filename The path to the configuration file that is to be written.
   */
  public saveConfig(filename: string) {
    this.config.saveToFile(filename);
  }

  /**
   * Get the current configuration as JSON string.
   * The password field is set to null.
   */
  public getJsonConfigWithoutPassword(): string {
    return this.config.toJSON(false, true);
  }

  /**
   * Updates the config with the values of the (partial) config that is provided as a parameter.
   * Fields that are missing in the partial config remain unchanged.
   *
   * @param config The (partial) config containing the new values.
   */
  public adjustConfig(config: NullableConfig) {
    this.config.adjust(config);
    this.refreshConfig();
  }

  /**
   * Returns the description, which can be displayed in the title bar.
   */
  public getTitle(): string | null {
    return this.config.title || null;
  }

  /**
   * Get a list of MixData object for all the configured mixes.
   * Can be used for the overview over the configured mixes.
   */
  public getMixes(): MixData[] {
    return this.config.mixes
      .map((mixAssignment) => this.mixer.getMixData(mixAssignment.mix))
      .filter(notNull);
  }

  /**
   * Get the MixData for a single mix.
   * If no such mix exists, null is returned.
   *
   * @param id The mix whose MixData is requested.
   */
  public getMix(id: string): MixData | null {
    return this.mixer.getMixData(id);
  }

  /**
   * Get a list of InputData objects for all the configured inputs of a mix.
   *
   * @param id The ID of the mix for which the associated InputData objects are requested.
   */
  public getInputs(id: string): InputData[] {
    // Get a list of input IDs.
    const inputs =
      this.config.mixes.find((mixAssignment) => mixAssignment.mix === id)
        ?.inputs ?? [];

    // Get the corresponding InputData objects.
    return inputs
      .map((input) => this.mixer.getInputData(id, input))
      .filter(notNull);
  }

  /**
   * Get the InputData for a single input.
   * If no such input exists, null is returned.
   *
   * @param mixId The mix for which the InputData is meant.
   * @param inputId The ID of the input for which the data is requested.
   */
  public getInput(mixId: string, inputId: string): InputData | null {
    return this.mixer.getInputData(mixId, inputId);
  }

  /**
   * Get the mix IDs of all the configured mixes.
   */
  public getConfiguredMixIds(): string[] {
    return this.config.mixes.map((mixAssignment) => mixAssignment.mix);
  }

  /**
   * Get the input IDs of all inputs that are configured for a given mix.
   *
   * @param mix The ID of the mix which inputs are requested.
   */
  public getConfiguredInputIds(mix: string): string[] {
    return (
      this.config.mixes.find((mixAssignment) => mixAssignment.mix === mix)
        ?.inputs ?? []
    );
  }

  /**
   * Get a meters string that indicates the current meter levels of inputs and/or mixes.
   * Each character of the string corresponds to the input or mix given at the respective index.
   * The characters are base64 encoded and can represent values between 0 and 63.
   *
   * @param ids The list of input/mix IDs for which the meter values are requested.
   */
  public getMetersString(ids: string[]): string {
    return this.mixer.getMetersString(ids);
  }

  /**
   * Register callbacks that are called when changes occur on the mixer.
   *
   * @param callbacks The callbacks to be registered.
   */
  public registerListeners(callbacks: MixerUpdateCallbacks): void {
    this.mixer.registerListeners(callbacks);
  }

  /**
   * Remove callbacks that were previously registered.
   *
   * @param callbacks The exact same callbacks instance that was previously registered and is now to be removed.
   */
  public unregisterListeners(callbacks: MixerUpdateCallbacks): void {
    this.mixer.unregisterListeners(callbacks);
  }

  public registerConfigChangeListener(callback: () => void) {
    this.configChangeListeners.push(callback);
  }

  public unregisterConfigChangeListener(callback: () => void) {
    this.configChangeListeners = this.configChangeListeners.filter(
      (cb) => cb !== callback,
    );
  }

  /**
   * Set a new level for an input or mix.
   * If input is null, the level change affects the mix itself,
   * otherwise, it affects the level with which the given input sends to the given mix.
   *
   * @param level The new level as a float between 0 and 1.
   * @param mix The mix that is affected by this change.
   * @param input The input that is affected by this change or null if the mix itself is to be changed.
   */
  public setLevel(level: number, mix: string, input: string | null) {
    this.mixer.setLevel(level, mix, input);
  }

  /**
   * Set a new mute status for an input or mix.
   * If input is null, the mute change affects the mix itself,
   * otherwise, it affects whether the given input sends to the given mix.
   *
   * @param state True if the signal should be muted, otherwise false.
   * @param mix The mix that is affected by this change.
   * @param input The input that is affected by this change or null if the mix itself is to be changed.
   */
  public setMute(state: boolean, mix: string, input: string | null) {
    this.mixer.setMute(state, mix, input);
  }

  /**
   * Check if a given password hash matches the configured password.
   * @param password The password hash that is to be checked.
   */
  public checkPassword(password: String): boolean {
    return this.config.password === password;
  }

  /**
   * Adjust the current data (especially mixer data) according to a configuration change.
   * Calls the registered config change listeners.
   */
  private refreshConfig() {
    if (this.config.mixer != this.mixer.getMixerName()) {
      const listeners = this.mixer.getListeners();
      listeners.forEach((listener) => this.mixer.unregisterListeners(listener));
      this.mixer.stop();
      this.mixer = MixerFactory.createMixer(this.config.mixer, this.config.ip);
      listeners.forEach((listener) => this.mixer.registerListeners(listener));
    }
    if (this.mixer.ip !== this.config.ip) {
      this.mixer.setIp(this.config.ip);
    }

    this.configChangeListeners.forEach((cb) => cb());
  }
}

export default App;
