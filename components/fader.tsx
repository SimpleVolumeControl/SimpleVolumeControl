import { FC } from 'react';

interface FaderProps {
  level: number;
  sendLevel: (value: number) => void;
}

const Fader: FC<FaderProps> = ({ level, sendLevel }) => {
  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={level}
      className="range range-lg fader relative"
      onInput={(e) =>
        sendLevel(parseFloat((e.target as HTMLInputElement).value))
      }
    />
  );
};

export default Fader;
