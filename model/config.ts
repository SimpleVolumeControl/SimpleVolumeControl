import MixAssignment from './mixAssignment';
import { ensureRecord, isObject } from '../utils/helpers';
import * as fs from 'fs';
import {
  getAllInputs,
  getAllMixes,
  getAvailableMixers,
} from '../common/mixerProperties';
import NullableConfig from './nullableConfig';
import crypto from 'crypto';

const emptyPassword = crypto.createHash('sha256').update('').digest('base64');

/**
 * This class represents the configuration of SimpleVolumeControl.
 */
class Config implements NullableConfig {
  /**
   * The IP address by which the mixer can be reached.
   */
  ip: string = '';

  /**
   * The type of mixing console used.
   * Must match the identifier of an available mixer type in SimpleVolumeControl.
   */
  mixer: string = '';

  /**
   * The selection of mixes used, together with their inputs.
   */
  mixes: MixAssignment[] = [];

  /**
   * The password hash that is used for authentication.
   * Defaults to the hash of the empty password.
   */
  password: string = emptyPassword;

  /**
   * Initializes a valid configuration.
   */
  constructor() {
    this.validate();
  }

  /**
   * Read a configuration file and use its content as a configuration from now on.
   *
   * @param filename The path to the configuration file that is to be read.
   */
  public readFromFile(filename: string) {
    try {
      this.fromJSON(fs.readFileSync(filename, 'utf8'));
    } catch (e) {
      console.log('An error occurred when reading the config file.');
    }
  }

  /**
   * Save the currently used configuration to a file.
   *
   * @param filename The path to the configuration file that is to be written.
   */
  public saveToFile(filename: string) {
    try {
      fs.writeFileSync(filename, this.toJSON(true));
    } catch (e) {
      console.log('An error occurred when writing the config file.');
    }
  }

  /**
   * Get the JSON representation of the configuration.
   *
   * @param pretty If set to true, the JSON output is formatted for better readability.
   * @param redactPassword If set to true, the password will be set to null in the JSON output.
   */
  public toJSON(pretty = false, redactPassword = false) {
    return JSON.stringify(
      {
        ip: this.ip,
        mixer: this.mixer,
        mixes: this.mixes,
        password: redactPassword ? null : this.password,
      },
      undefined,
      pretty ? 2 : undefined,
    );
  }

  /**
   * Read the configuration from a JSON string and use it from now on.
   * This method already ensures that the types are correct
   * and thus does basic validation even before calling validate().
   * Invalid values will be replaced with fallback values.
   *
   * @param json The JSON configuration string to be read in.
   */
  public fromJSON(json: string) {
    // Try to read in the configuration.
    let rawConfig: unknown = {};
    try {
      rawConfig = JSON.parse(json);
    } catch (e) {}

    // Ensure that the correct data types are used.
    const config = ensureRecord(rawConfig);
    this.ip = typeof config?.ip === 'string' ? config.ip : '';
    this.mixer = typeof config?.mixer === 'string' ? config.mixer : '';
    if (!Array.isArray(config?.mixes)) {
      this.mixes = [];
    } else {
      this.mixes = (config?.mixes ?? []).filter((element: unknown) => {
        if (!isObject(element) || Array.isArray(element)) {
          return false;
        }
        if (typeof element?.mix !== 'string') {
          return false;
        }
        if (!Array.isArray(element?.inputs)) {
          return false;
        }
        return element.inputs.every((input) => typeof input === 'string');
      });
    }
    this.password =
      typeof config?.password === 'string' ? config.password : emptyPassword;

    // Perform some more in depth validation.
    this.validate();
  }

  public adjust(config: NullableConfig) {
    if (config.ip) {
      this.ip = config.ip;
    }
    if (config.mixer) {
      this.mixer = config.mixer;
    }
    if (config.mixes) {
      this.mixes = config.mixes;
    }
    if (config.password !== null && config.password !== undefined) {
      this.password = config.password;
    }
    this.validate();
  }

  /**
   * This method ensures that the used values make sense from a domain logic point of view.
   * The correct data types have to be ensured before calling this method.
   */
  private validate() {
    // Replace empty IP addresses with the IP address of localhost.
    if (!this.ip) {
      this.ip = '127.0.0.1';
    }

    // Make sure that a valid mixer type is used.
    if (!(this.mixer in getAvailableMixers())) {
      // In the long term, this should probably be changed.
      // For now, Behringer X32 is the only actual mixer and thus a reasonable default.
      this.mixer = 'Behringer X32';
    }

    // Validate the actual mixes configuration.

    const inputs = getAllInputs(this.mixer);
    const mixes = getAllMixes(this.mixer);

    // Store already visited mix names here to avoid duplicate entries for a single mix.
    // This solution is based on the "Hashtable" approach found at https://stackoverflow.com/a/9229821
    const seen: Record<string, boolean> = {};
    this.mixes = this.mixes.filter(
      (mixAssignment) =>
        mixes.includes(mixAssignment.mix) &&
        (mixAssignment.mix in seen ? false : (seen[mixAssignment.mix] = true)),
    );

    this.mixes.forEach((mixAssignment) => {
      mixAssignment.inputs = mixAssignment.inputs.filter((input) =>
        inputs.includes(input),
      );
    });
  }
}

export default Config;
