import { isArray, isRecord } from '../utils/helpers';

/**
 * Links a mix to a list of inputs.
 */
interface MixAssignment {
  /**
   * The identifier of the mix.
   */
  mix: string;

  /**
   * A list of identifiers for inputs, that should be associated with the mix.
   */
  inputs: string[];
}

export const isMixAssignment = (data: unknown): data is MixAssignment =>
  isRecord(data) &&
  typeof data.mix === 'string' &&
  isArray(data.inputs) &&
  data.inputs.every((input) => typeof input === 'string');

export default MixAssignment;
