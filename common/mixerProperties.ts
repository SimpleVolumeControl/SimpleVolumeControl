import mixerData from '../model/mixers.json';

/**
 * Get a list of all input identifiers for a given mixer type.
 * @param mixerType The identifier of the mixer for which the inputs should be returned.
 */
export function getAllInputs(mixerType: string): string[] {
  return mixerData[mixerType]?.inputs ?? [];
}

/**
 * Get a list of all mix identifiers for a given mixer type.
 * @param mixerType The identifier of the mixer for which the mixes should be returned.
 */
export function getAllMixes(mixerType: string): string[] {
  return mixerData[mixerType]?.mixes ?? [];
}

/**
 * Get a list of all supported mixer types.
 */
export function getAvailableMixers(): string[] {
  return Object.keys(mixerData);
}
