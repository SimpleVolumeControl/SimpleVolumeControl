import MixAssignment, { isMixAssignment } from './mixAssignment';
import { isArray, isRecord } from '../utils/helpers';

interface NullableConfig {
  /**
   * The IP address by which the mixer can be reached.
   */
  ip?: string | null;

  /**
   * The type of mixing console used.
   * Must match the identifier of an available mixer type in SimpleVolumeControl.
   */
  mixer?: string | null;

  /**
   * The selection of mixes used, together with their inputs.
   */
  mixes?: MixAssignment[] | null;

  /**
   * The password that is used for authentication.
   * Currently stored in plain text on the server side, but this may change in the future.
   */
  password?: string | null;
}

export const isNullableConfig = (data: unknown): data is NullableConfig =>
  isRecord(data) &&
  (typeof data.ip === 'string' || data.ip == null) &&
  (typeof data.mixer === 'string' || data.mixer == null) &&
  (data.mixes == null ||
    (isArray(data.mixes) && data.mixes.every((mix) => isMixAssignment(mix)))) &&
  (typeof data.password === 'string' || data.password == null);

export default NullableConfig;
