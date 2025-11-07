import { FC } from 'react';

interface FaderProps {
  // The level of this fader as a number between 0 and 1.
  level: number;

  // A function that gets called when a level status change is initiated,
  // i.e. when the fader is moved.
  // It receives the new level as a number between 0 and 1.
  sendLevel: (value: number) => void;
}

/**
 * This component provides a single horizontal volume fader,
 * similar to faders on an actual mixing console.
 */
const Fader: FC<FaderProps> = ({ level, sendLevel }) => {
  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={level}
      className="range range-lg fader relative w-full"
      onInput={(e) =>
        sendLevel(parseFloat((e.target as HTMLInputElement).value))
      }
    />
  );
};

export default Fader;
