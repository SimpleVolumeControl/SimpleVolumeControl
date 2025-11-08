/**
 * The possible data types for OSC parameters.
 */
export enum OscParameterType {
  STRING = 'string',
  INT = 'int',
  FLOAT = 'float',
  BLOB = 'blob',
}

/**
 * Convert the characters that identify the parameter types to their corresponding enum values.
 * Returns null for invalid characters.
 *
 * @param char The character to be converted.
 */
export function charToOscParameterType(char: string): OscParameterType | null {
  switch (char) {
    case 's':
      return OscParameterType.STRING;
    case 'i':
      return OscParameterType.INT;
    case 'f':
      return OscParameterType.FLOAT;
    case 'b':
      return OscParameterType.BLOB;
    default:
      return null;
  }
}

/**
 * A single OSC parameter, consisting of a type and a value.
 */
export interface OscParameter {
  type?: OscParameterType;
  value: string | number | Buffer;
}

/**
 * This class represents OSC messages.
 * They contain the command or address as well as a list of parameters.
 */
class OscMessage {
  /**
   * The command or address portion of the OSC message.
   */
  readonly command: string;

  /**
   * The list of parameters of the OSC message.
   */
  readonly parameters: OscParameter[];

  /**
   * Creates a new OSC message from a command and a list of parameters
   *
   * @param command The command portion of the OSC message.
   * @param parameters The parameters of the OSC message.
   */
  constructor(command: string, parameters: OscParameter[] | string = []) {
    this.command = command;
    if (typeof parameters === 'string') {
      this.parameters = [{ type: OscParameterType.STRING, value: parameters }];
    } else {
      this.parameters = parameters;
    }
  }

  /**
   * Bring the OSC message in a nicely printable form.
   */
  toString(): string {
    return `${this.command} [ ${this.parameters.map(
      (param) => `${param.type?.toString()}: ${param.value}`,
    )} ]`;
  }

  /**
   * Get the binary representation of the OSC message.
   * Useful for sending the OSC message via UDP.
   */
  toBuffer(): Buffer {
    // Collect the parameter types here (as a string).
    let parameterTypes = ',';

    // Collect the concatenated (and padded if necessary) parameter values as a number array.
    // Every number represents one byte.
    const parameters: number[] = [];

    // Iterate over all parameters to add them to the storage variables defined above.
    this.parameters.forEach((parameter) => {
      const value = parameter.value;
      // Blobs are never sent and can thus be omitted here.
      switch (parameter.type) {
        case OscParameterType.INT:
          if (typeof value === 'number') {
            parameterTypes += 'i';
            const buf = Buffer.alloc(4);
            buf.writeInt32BE(value, 0);
            parameters.push(...buf);
          }
          break;
        case OscParameterType.FLOAT:
          if (typeof value === 'number') {
            parameterTypes += 'f';
            const buf = Buffer.alloc(4);
            buf.writeFloatBE(value, 0);
            parameters.push(...buf);
          }
          break;
        case OscParameterType.STRING:
          if (typeof value === 'string') {
            parameterTypes += 's';
            parameters.push(...Buffer.from(OscMessage.pad(value), 'ascii'));
          }
          break;
      }
    });

    // Assemble the final buffer with the binary representation of the OSC message.
    return Buffer.from([
      ...Buffer.from(OscMessage.pad(this.command), 'ascii'),
      ...Buffer.from(OscMessage.pad(parameterTypes), 'ascii'),
      ...parameters,
    ]);
  }

  /**
   * Parse a binary OSC message in order to create an OscMessage object from it.
   *
   * @param msg The binary message to parse.
   */
  static fromBuffer(msg: Buffer): OscMessage {
    // TODO Error handling (for malformed messages etc)

    // The command portion of the OSC message goes up to the first NULL byte.
    const commandEnd = msg.indexOf(0);
    const command = msg.toString('ascii', 0, commandEnd);

    // Collect all parameters here.
    const params: OscParameter[] = [];

    // The command portion of the OSC message is padded with 1 to 4 NULL bytes
    // so that the total number of bytes including this padding is a multiple of 4.
    // After this padding, the parameter types portion of the OSC message begins.

    // Plus one because the first character is always a comma which can be ignored here.
    const paramTypesStart = commandEnd + (4 - (commandEnd % 4)) + 1;

    // The parameter types portion also ends with NULL bytes and is padded in the same way as described above.
    const paramTypesEnd = msg.indexOf(0, paramTypesStart);
    const paramTypes = msg.toString('ascii', paramTypesStart, paramTypesEnd);

    // Read out the parameter types one by one.
    let paramStart = paramTypesEnd + (4 - (paramTypesEnd % 4));
    paramTypes.split('').forEach((t) => {
      const paramType = charToOscParameterType(t);
      if (paramType === null) {
        return;
      }
      // Integer and float parameters are exactly 4 bytes long,
      // all other types are at least 4 bytes long.
      let paramEnd = paramStart + 4;
      let param: string | number | Buffer = '';
      switch (paramType) {
        case OscParameterType.STRING:
          // Strings are NULL padded in the same way as described above.
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
        case OscParameterType.BLOB:
          // Blobs contain their length at the beginning
          // (not including the length information itself).
          paramEnd += msg.readInt32BE(paramStart);
          param = msg.slice(
            paramStart + 4,
            paramEnd < msg.length ? paramEnd : msg.length,
          );
          break;
      }
      params.push({ type: paramType, value: param });
      paramStart = paramEnd;
    });
    return new OscMessage(command, params);
  }

  /**
   * Helper function to pad OSC commands, parameter types and string parameters
   * in such a way, that one two four NULL bytes are added so that the total length
   * is a multiple of four.
   * @param data The string to be padded.
   */
  private static pad(data: string): string {
    return data + '\0'.repeat(4 - (data.length % 4));
  }
}

export default OscMessage;
