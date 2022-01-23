export enum OscParameterType {
  STRING = 'string',
  INT = 'int',
  FLOAT = 'float',
}

export namespace OscParameterType {
  export function fromChar(char: string): OscParameterType | null {
    switch (char) {
      case 's':
        return OscParameterType.STRING;
      case 'i':
        return OscParameterType.INT;
      case 'f':
        return OscParameterType.FLOAT;
      default:
        return null;
    }
  }
}

export interface OscParameter {
  type?: OscParameterType;
  value: string | number;
}

class OscMessage {
  readonly command: string;
  readonly parameters: OscParameter[];

  constructor(command: string, parameters: OscParameter[] | string = []) {
    this.command = command;
    if (typeof parameters === 'string') {
      this.parameters = [{ type: OscParameterType.STRING, value: parameters }];
    } else {
      this.parameters = parameters;
    }
  }

  toString(): string {
    return `${this.command} [ ${this.parameters.map(
      (param) => `${param.type?.toString()}: ${param.value}`,
    )} ]`;
  }

  toBuffer(): Buffer {
    let argtypes = ',';
    let readyargs: number[] = [];
    this.parameters.forEach((parameter) => {
      const value = parameter.value;
      switch (parameter.type) {
        case OscParameterType.INT:
          if (typeof value === 'number') {
            argtypes += 'i';
            const buf = Buffer.alloc(4);
            buf.writeInt32BE(value, 0);
            readyargs.push(...buf);
          }
          break;
        case OscParameterType.FLOAT:
          if (typeof value === 'number') {
            argtypes += 'f';
            const buf = Buffer.alloc(4);
            buf.writeFloatBE(value, 0);
            readyargs.push(...buf);
          }
          break;
        case OscParameterType.STRING:
          if (typeof value === 'string') {
            argtypes += 's';
            readyargs.push(...Buffer.from(OscMessage.pad(value), 'ascii'));
          }
          break;
      }
    });
    return Buffer.from([
      ...Buffer.from(OscMessage.pad(this.command), 'ascii'),
      ...Buffer.from(OscMessage.pad(argtypes), 'ascii'),
      ...readyargs,
    ]);
  }

  // TODO Error handling (for malformed messages etc)
  static fromBuffer(msg: Buffer): OscMessage {
    const commandEnd = msg.indexOf(0);
    const command = msg.toString('ascii', 0, commandEnd);

    const params: OscParameter[] = [];

    // Plus one because the first character is always a comma which can be ignored here.
    const paramTypesStart = commandEnd + (4 - (commandEnd % 4)) + 1;
    const paramTypesEnd = msg.indexOf(0, paramTypesStart);
    const paramTypes = msg.toString('ascii', paramTypesStart, paramTypesEnd);

    let paramStart = paramTypesEnd + (4 - (paramTypesEnd % 4));
    paramTypes.split('').forEach((t) => {
      const paramType = OscParameterType.fromChar(t);
      if (paramType === null) {
        return;
      }
      let paramEnd = paramStart + 4;
      let param: string | number = '';
      switch (paramType) {
        case OscParameterType.STRING:
          paramEnd = msg.indexOf(0, paramStart);
          param = msg.toString(
            'ascii',
            paramStart,
            paramEnd < 0 ? msg.length : paramEnd,
          );
          paramEnd += 4 - (paramEnd % 4);
          break;
        case OscParameterType.INT:
          param = msg.readInt32BE(paramStart);
          break;
        case OscParameterType.FLOAT:
          param = msg.readFloatBE(paramStart);
          break;
      }
      params.push({ type: paramType, value: param });
      paramStart = paramEnd;
    });
    return new OscMessage(command, params);
  }

  private static pad(data: string): string {
    return data + '\0'.repeat(4 - (data.length % 4));
  }
}

export default OscMessage;
