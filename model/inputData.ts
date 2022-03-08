import { isRecord } from '../utils/helpers';

/**
 * Bundles all relevant data associated with an input.
 * The level and mute data refer to a specific mix send.
 */
interface InputData {
  /**
   * The identifier of the input.
   */
  id: string;

  /**
   * The name of the input as set in the mixing console.
   */
  name: string;

  /**
   * The color of the input as set in the mixing console.
   */
  color: string;

  /**
   * The level with which the input sends to a specific mix.
   */
  level: number;

  /**
   * Indicates if the input is muted in regard to a specific mix send.
   */
  mute: boolean;
}

/**
 * Check if a value matches the InputData interface.
 *
 * @param data The data to be checked.
 */
export const isInputData = (data: unknown): data is InputData =>
  isRecord(data) &&
  typeof data.id === 'string' &&
  typeof data.name === 'string' &&
  typeof data.color === 'string' &&
  typeof data.level === 'number' &&
  typeof data.mute === 'boolean';

export default InputData;
