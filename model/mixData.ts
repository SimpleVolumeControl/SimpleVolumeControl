import { isRecord } from '../utils/helpers';

interface MixData {
  id: string;
  name: string;
  color: string;
  level: number;
  mute: boolean;
}

export const isMixData = (data: unknown): data is MixData =>
  isRecord(data) &&
  typeof data.id === 'string' &&
  typeof data.name === 'string' &&
  typeof data.color === 'string' &&
  typeof data.level === 'number' &&
  typeof data.mute === 'boolean';

export default MixData;
