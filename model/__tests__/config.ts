import Config from '../config';
import mixerData from '../mixers.json';

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
    expect(config.mixes?.[0]?.mix).toEqual('bus-01');
    expect(config.mixes?.[0]?.inputs).toEqual(['ch-01', 'auxin-01']);
    expect(config.mixes?.[1]?.mix).toEqual('main-st');
    expect(config.mixes?.[1]?.inputs).toEqual(['ch-01', 'ch-02', 'ch-03']);
    expect(config.mixer).toBe('Behringer X32');
    expect(config.ip).toBe('192.168.0.42');
    expect(config.password).toBe('foobaz');
  });
  test('should export JSON correctly', () => {
    const config = new Config();
    config.readFromFile('./model/__tests__/configTestData.json');
    expect(config.toJSON(true)).toBe(
      '{\n' +
        '  "title": "Test data",\n' +
        '  "ip": "192.168.0.42",\n' +
        '  "mixer": "Behringer X32",\n' +
        '  "mixes": [\n' +
        '    {\n' +
        '      "mix": "bus-01",\n' +
        '      "inputs": [\n' +
        '        "ch-01",\n' +
        '        "auxin-01"\n' +
        '      ]\n' +
        '    },\n' +
        '    {\n' +
        '      "mix": "main-st",\n' +
        '      "inputs": [\n' +
        '        "ch-01",\n' +
        '        "ch-02",\n' +
        '        "ch-03"\n' +
        '      ]\n' +
        '    }\n' +
        '  ],\n' +
        '  "password": "foobaz"\n' +
        '}',
    );
    expect(config.toJSON()).toBe(
      '{"title":"Test data","ip":"192.168.0.42","mixer":"Behringer X32","mixes":[{"mix":"bus-01","inputs":["ch-01","auxin-01"]},{"mix":"main-st","inputs":["ch-01","ch-02","ch-03"]}],"password":"foobaz"}',
    );
  });
});
