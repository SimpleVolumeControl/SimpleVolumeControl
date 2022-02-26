import { isRecord } from '../utils/helpers';

interface InputData {
  id: string;
  name: string;
  color: string;
  level: number;
  mute: boolean;
}

export const isInputData = (data: unknown): data is InputData =>
  isRecord(data) &&
  typeof data.id === 'string' &&
  typeof data.name === 'string' &&
  typeof data.color === 'string' &&
  typeof data.level === 'number' &&
  typeof data.mute === 'boolean';

export default InputData;
