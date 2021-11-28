import Config from '../config';
import { mixerData } from '../mixerFactory';

describe('Config', () => {
  test('should contain valid data after initialization', () => {
    const config = new Config();
    expect(config.mixes).toEqual([]);
    expect(config.mixer in mixerData).toBe(true);
    expect(config.ip).toMatch(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/);
  });
  test('should cope with invalid JSON', () => {
    const config = new Config();
    config.fromJSON('foobar');
    expect(config.mixes).toEqual([]);
    expect(config.mixer in mixerData).toBe(true);
    expect(config.ip).toMatch(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/);
  });
  test('should cope with malformed JSON data (array)', () => {
    const config = new Config();
    config.fromJSON('["foobar"]');
    expect(config.mixes).toEqual([]);
    expect(config.mixer in mixerData).toBe(true);
    expect(config.ip).toMatch(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/);
  });
  test('should cope with malformed JSON data (object)', () => {
    const config = new Config();
    config.fromJSON('{"foo": "bar"}');
    expect(config.mixes).toEqual([]);
    expect(config.mixer in mixerData).toBe(true);
    expect(config.ip).toMatch(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/);
  });
  test('should import from JSON file correctly (ignoring invalid entries)', () => {
    const config = new Config();
    config.readFromFile('./model/__tests__/configTestData.json');
    expect(config.mixes?.[0]?.mix).toEqual('bus01');
    expect(config.mixes?.[0]?.inputs).toEqual(['ch01', 'aux01']);
    expect(config.mixes?.[1]?.mix).toEqual('lr');
    expect(config.mixes?.[1]?.inputs).toEqual(['ch01', 'ch02', 'ch03']);
    expect(config.mixer).toBe('Behringer X32');
    expect(config.ip).toBe('192.168.0.42');
    expect(config.password).toBe('foobaz');
  });
  test('should export JSON correctly', () => {
    const config = new Config();
    config.readFromFile('./model/__tests__/configTestData.json');
    expect(config.toJSON(true)).toBe(
      '{\n' +
        '  "ip": "192.168.0.42",\n' +
        '  "mixer": "Behringer X32",\n' +
        '  "mixes": [\n' +
        '    {\n' +
        '      "mix": "bus01",\n' +
        '      "inputs": [\n' +
        '        "ch01",\n' +
        '        "aux01"\n' +
        '      ]\n' +
        '    },\n' +
        '    {\n' +
        '      "mix": "lr",\n' +
        '      "inputs": [\n' +
        '        "ch01",\n' +
        '        "ch02",\n' +
        '        "ch03"\n' +
        '      ]\n' +
        '    }\n' +
        '  ],\n' +
        '  "password": "foobaz"\n' +
        '}',
    );
    expect(config.toJSON()).toBe(
      '{"ip":"192.168.0.42","mixer":"Behringer X32","mixes":[{"mix":"bus01","inputs":["ch01","aux01"]},{"mix":"lr","inputs":["ch01","ch02","ch03"]}],"password":"foobaz"}',
    );
  });
});
