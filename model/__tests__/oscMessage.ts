import OscMessage, { OscParameterType } from '../oscMessage';

describe('OscMessage', () => {
  test('should construct OSC parameter type from string', () => {
    expect(OscParameterType.fromChar('i')).toBe(OscParameterType.INT);
    expect(OscParameterType.fromChar('f')).toBe(OscParameterType.FLOAT);
    expect(OscParameterType.fromChar('s')).toBe(OscParameterType.STRING);
    expect(OscParameterType.fromChar('x')).toBe(null);
  });

  test('should construct OSC command without parameters', () => {
    const msg = new OscMessage('/test');
    expect(msg.command).toBe('/test');
    expect(msg.parameters).toEqual([]);
  });

  test('should construct OSC command with string parameter', () => {
    const msg = new OscMessage('/test', 'foobar');
    expect(msg.command).toBe('/test');
    expect(msg.parameters).toEqual([
      { type: OscParameterType.STRING, value: 'foobar' },
    ]);
  });

  test('should construct OSC command with array parameter', () => {
    const msg = new OscMessage('/test', [
      { type: OscParameterType.STRING, value: 'foobar' },
      { type: OscParameterType.FLOAT, value: 1.23 },
      { type: OscParameterType.INT, value: 42 },
    ]);
    expect(msg.command).toBe('/test');
    expect(msg.parameters).toEqual([
      { type: OscParameterType.STRING, value: 'foobar' },
      { type: OscParameterType.FLOAT, value: 1.23 },
      { type: OscParameterType.INT, value: 42 },
    ]);
  });

  test('should pad command properly', () => {
    expect(new OscMessage('/').toBuffer()).toEqual(
      Buffer.from([47, 0, 0, 0, 44, 0, 0, 0]),
    );
    expect(new OscMessage('/a').toBuffer()).toEqual(
      Buffer.from([47, 97, 0, 0, 44, 0, 0, 0]),
    );
    expect(new OscMessage('/aa').toBuffer()).toEqual(
      Buffer.from([47, 97, 97, 0, 44, 0, 0, 0]),
    );
    expect(new OscMessage('/aaa').toBuffer()).toEqual(
      Buffer.from([47, 97, 97, 97, 0, 0, 0, 0, 44, 0, 0, 0]),
    );
    expect(new OscMessage('/aaaa').toBuffer()).toEqual(
      Buffer.from([47, 97, 97, 97, 97, 0, 0, 0, 44, 0, 0, 0]),
    );
  });

  test('should append int parameter properly', () => {
    const buffer = new OscMessage('/', [
      { type: OscParameterType.INT, value: 202201 },
    ]).toBuffer();
    expect(buffer).toEqual(
      Buffer.from([47, 0, 0, 0, 44, 105, 0, 0, 0, 3, 21, 217]),
    );
  });

  test('should append float parameter properly', () => {
    const buffer = new OscMessage('/', [
      { type: OscParameterType.FLOAT, value: 3.1415 },
    ]).toBuffer();
    expect(buffer).toEqual(
      Buffer.from([47, 0, 0, 0, 44, 102, 0, 0, 64, 73, 14, 86]),
    );
  });

  test('should append string parameter properly', () => {
    const buffer = new OscMessage('/', [
      { type: OscParameterType.STRING, value: 'foobar' },
    ]).toBuffer();
    expect(buffer).toEqual(
      Buffer.from([
        47, 0, 0, 0, 44, 115, 0, 0, 102, 111, 111, 98, 97, 114, 0, 0,
      ]),
    );
  });

  test('should append multiple parameters properly', () => {
    const buffer = new OscMessage('/', [
      { type: OscParameterType.FLOAT, value: 3.1415 },
      { type: OscParameterType.STRING, value: 'foobar' },
      { type: OscParameterType.INT, value: 202201 },
    ]).toBuffer();
    expect(buffer).toEqual(
      // prettier-ignore
      Buffer.from([
        47, 0, 0, 0, // '/'
        44, 102, 115, 105, 0, 0, 0, 0, // ',fsi'
        64, 73, 14, 86, // 3.1415
        102, 111, 111, 98, 97, 114, 0, 0, // 'foobar'
        0, 3, 21, 217, // 202201
      ]),
    );
  });

  test('should read parameterless buffer correctly', () => {
    const msg = OscMessage.fromBuffer(Buffer.from([47, 97, 0, 0, 44, 0, 0, 0]));
    expect(msg.command).toBe('/a');
    expect(msg.parameters).toEqual([]);
  });

  test('should read int parameter correctly', () => {
    const msg = OscMessage.fromBuffer(
      Buffer.from([47, 0, 0, 0, 44, 105, 0, 0, 0, 3, 21, 217]),
    );
    expect(msg.command).toBe('/');
    expect(msg.parameters).toEqual([
      { type: OscParameterType.INT, value: 202201 },
    ]);
  });

  test('should read float parameter correctly', () => {
    const msg = OscMessage.fromBuffer(
      Buffer.from([47, 0, 0, 0, 44, 102, 0, 0, 64, 73, 14, 86]),
    );
    expect(msg.command).toBe('/');
    expect(msg.parameters).toEqual([
      { type: OscParameterType.FLOAT, value: 3.1414999961853027 },
    ]);
  });

  test('should read string parameter correctly', () => {
    const msg = OscMessage.fromBuffer(
      Buffer.from([
        47, 0, 0, 0, 44, 115, 0, 0, 102, 111, 111, 98, 97, 114, 0, 0,
      ]),
    );
    expect(msg.command).toBe('/');
    expect(msg.parameters).toEqual([
      { type: OscParameterType.STRING, value: 'foobar' },
    ]);
  });

  test('should read multiple parameters correctly', () => {
    const msg = OscMessage.fromBuffer(
      // prettier-ignore
      Buffer.from([
        47, 0, 0, 0, // '/'
        44, 102, 115, 105, 0, 0, 0, 0, // ',fsi'
        64, 73, 14, 86, // 3.1415
        102, 111, 111, 98, 97, 114, 0, 0, // 'foobar'
        0, 3, 21, 217, // 202201
      ]),
    );
    expect(msg.command).toBe('/');
    expect(msg.parameters).toEqual([
      { type: OscParameterType.FLOAT, value: 3.1414999961853027 },
      { type: OscParameterType.STRING, value: 'foobar' },
      { type: OscParameterType.INT, value: 202201 },
    ]);
  });
});
