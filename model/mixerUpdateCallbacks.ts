interface MixerUpdateCallbacks {
  onMixChange?: (mix: string) => void;
  onInputChange?: (input: string) => void;
  onLevelChange?: (mix: string, input: string | null) => void;
  onMuteChange?: (mix: string, input: string | null) => void;
  onMetersChange?: () => void;
}

export default MixerUpdateCallbacks;
