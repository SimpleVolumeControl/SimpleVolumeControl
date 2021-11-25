import MixAssignment from './mixAssignment';

class Config {
  ip: string;
  mixer: string;
  mixes: MixAssignment[];
  password: string;

  constructor() {
    this.ip = '192.168.2.208';
    this.mixer = 'Behringer X32';
    this.mixes = [
      {
        mix: 'bus01',
        inputs: [],
      },
    ];
    this.password = '';
  }

  public readFromFile(filename: string) {}
  public saveToFile(filename: string) {}
  public toJSON() {}
  public fromJSON() {}

  private validate() {}
}

export default Config;
