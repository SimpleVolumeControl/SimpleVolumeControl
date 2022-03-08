import { isRecord } from '../utils/helpers';

/**
 * Bundles all relevant data associated with a mix.
 */
interface MixData {
  /**
   * The identifier of the mix.
   */
  id: string;

  /**
   * The name of the mix as set in the mixing console.
   */
  name: string;

  /**
   * The color of the mix as set in the mixing console.
   */
  color: string;

  /**
   * The level of the mix.
   */
  level: number;

  /**
   * Whether the mix is muted.
   */
  mute: boolean;
}

/**
 * Check if a value matches the MixData interface.
 *
 * @param data The data to be checked.
 */
export const isMixData = (data: unknown): data is MixData =>
  isRecord(data) &&
  typeof data.id === 'string' &&
  typeof data.name === 'string' &&
  typeof data.color === 'string' &&
  typeof data.level === 'number' &&
  typeof data.mute === 'boolean';

export default MixData;
