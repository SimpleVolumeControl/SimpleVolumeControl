/**
 * A collection of callback functions for various changes of the mixer.
 */
interface MixerUpdateCallbacks {
  /**
   * Called when a mix changes (e.g. color or name).
   *
   * @param mix The identifier of the changed mix.
   */
  onMixChange?: (mix: string) => void;

  /**
   * Called when an input changes (e.g. color or name).
   *
   * @param mix The identifier of the changed input.
   */
  onInputChange?: (input: string) => void;

  /**
   * Called when the level of an input or mix changes.
   *
   * @param mix The mix that is affected by the change.
   * @param input The input that is affected by the change or null if the mix itself is to be changed.
   */
  onLevelChange?: (mix: string, input: string | null) => void;

  /**
   * Called when the mute status of an input or mix changes.
   *
   * @param mix The mix that is affected by the change.
   * @param input The input that is affected by the change or null if the mix itself is to be changed.
   */
  onMuteChange?: (mix: string, input: string | null) => void;

  /**
   * Called when the meters values change.
   */
  onMetersChange?: () => void;
}

export default MixerUpdateCallbacks;
