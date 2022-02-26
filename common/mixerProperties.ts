import mixerData from '../model/mixers.json';

export function getAllInputs(mixerType: string): string[] {
  return mixerData[mixerType]?.inputs ?? [];
}

export function getAllMixes(mixerType: string): string[] {
  return mixerData[mixerType]?.mixes ?? [];
}

export function getAvailableMixers(): string[] {
  return Object.keys(mixerData);
}
