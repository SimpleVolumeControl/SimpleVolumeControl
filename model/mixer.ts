import InputData from './inputData';
import MixData from './mixData';
import MixerUpdateCallbacks from './mixerUpdateCallbacks';

/**
 * An abstract definition of a Mixer.
 * This allows to implement support for different kind of mixers without needing to adjust the whole system.
 * A concrete mixer should handle the communication with the actual mixing console.
 */
abstract class Mixer {
  /**
   * The IP address of the mixing console.
   */
  protected _ip: string;

  /**
   * Holds all registered mixer update callbacks.
   */
  protected callbacks: MixerUpdateCallbacks[] = [];

  /**
   * Initialize a mixer.
   * Stores the IP address for later usage.
   * @param ip The IP address of the mixing console.
   */
  protected constructor(ip: string) {
    this._ip = ip;
  }

  /**
   * Return the stored IP address.
   */
  get ip() {
    return this._ip;
  }

  /**
   * Change the IP address.
   * Implemented as private function so that the ip field appears as readonly to the outside.
   * Changing the IP address might require additional, mixer specific handling,
   * which can be achieved by overwriting the `setIp` method.
   *
   * @param ip The new IP address.
   */
  private set ip(ip) {
    this._ip = ip;
  }

  /**
   * Change the IP address by which the mixer is accessed.
   *
   * @param ip The new IP address of the mixer.
   */
  public setIp(ip: string) {
    this.ip = ip;
  }

  /**
   * A teardown function that is called before a mixer object becomes unused.
   * Can be used for cleanup tasks, e.g. to avoid memory leaks.
   */
  abstract stop(): void;

  /**
   * Get the InputData for a given input/mix combination or null.
   * In case the actual data isn't available, fallback data may be used.
   *
   * @param mixId The identifier of the mix to which the input sends to.
   * @param inputId The identifier of the input whose data is requested.
   */
  abstract getInputData(mixId: string, inputId: string): InputData | null;

  /**
   * Get the MixData for a given mix or null.
   * In case the actual data isn't available, fallback data may be used.
   *
   * @param id The identifier of the mix whose data is requested.
   */
  abstract getMixData(id: string): MixData | null;

  /**
   * Get a meters string that indicates the current meter levels of inputs and/or mixes.
   * Each character of the string corresponds to the input or mix given at the respective index.
   * The characters are base64 encoded and can represent values between 0 and 63.
   *
   * @param ids The list of input/mix IDs for which the meter values are requested.
   */
  abstract getMetersString(ids: string[]): string;

  /**
   * Register callbacks that are called when changes occur on the mixer.
   *
   * @param callbacks The callbacks to be registered.
   */
  registerListeners(callbacks: MixerUpdateCallbacks): void {
    this.callbacks.push(callbacks);
  }

  /**
   * Remove callbacks that were previously registered.
   *
   * @param callbacks The exact same callbacks instance that was previously registered and is now to be removed.
   */
  unregisterListeners(callbacks: MixerUpdateCallbacks): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callbacks);
  }

  /**
   * Get all currently registered listeners.
   *
   * @return A copy of the array with all currently registered listeners.
   */
  getListeners(): MixerUpdateCallbacks[] {
    return [...this.callbacks];
  }

  /**
   * Get the identifier of this type of mixing console.
   */
  abstract getMixerName(): string;

  /**
   * Set a new level for an input or mix.
   * If input is null, the level change affects the mix itself,
   * otherwise, it affects the level with which the given input sends to the given mix.
   *
   * @param level The new level as a float between 0 and 1.
   * @param mix The mix that is affected by this change.
   * @param input The input that is affected by this change or null if the mix itself is to be changed.
   */
  abstract setLevel(level: number, mix: string, input: string | null): void;

  /**
   * Set a new mute status for an input or mix.
   * If input is null, the mute change affects the mix itself,
   * otherwise, it affects the whether the given input sends to the given mix.
   *
   * @param state True if the signal should be muted, otherwise false.
   * @param mix The mix that is affected by this change.
   * @param input The input that is affected by this change or null if the mix itself is to be changed.
   */
  abstract setMute(state: boolean, mix: string, input: string | null): void;
}

export default Mixer;
