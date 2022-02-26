import MixAssignment from './mixAssignment';
import { ensureRecord, isObject } from '../utils/helpers';
import * as fs from 'fs';
import {
  getAllInputs,
  getAllMixes,
  getAvailableMixers,
} from '../common/mixerProperties';

class Config {
  ip: string = '';
  mixer: string = '';
  mixes: MixAssignment[] = [];
  password: string = '';

  constructor() {
    this.validate();
  }

  public readFromFile(filename: string) {
    try {
      this.fromJSON(fs.readFileSync(filename, 'utf8'));
    } catch (e) {
      console.log('An error occurred when reading the config file.');
    }
  }
  public saveToFile(filename: string) {
    try {
      fs.writeFileSync(filename, this.toJSON(true));
    } catch (e) {
      console.log('An error occurred when writing the config file.');
    }
  }

  public toJSON(pretty = false) {
    return JSON.stringify(
      {
        ip: this.ip,
        mixer: this.mixer,
        mixes: this.mixes,
        password: this.password,
      },
      undefined,
      pretty ? 2 : undefined,
    );
  }

  // This method already ensures that the types are correct
  // and thus does basic validation even before calling validate().
  public fromJSON(json: string) {
    let rawConfig: unknown = {};
    try {
      rawConfig = JSON.parse(json);
    } catch (e) {}
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
    this.password = typeof config?.password === 'string' ? config.password : '';
    this.validate();
  }

  // This method ensures that the used values make sense from a domain logic point of view.
  // The correct data types have to be ensured before calling this method.
  private validate() {
    if (!this.ip) {
      this.ip = '127.0.0.1';
    }

    if (!(this.mixer in getAvailableMixers())) {
      // In the long term, this should probably be changed.
      // For now, Behringer X32 is the only actual mixer and thus a reasonable default.
      this.mixer = 'Behringer X32';
    }

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
