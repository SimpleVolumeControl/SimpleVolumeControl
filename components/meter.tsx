import { FC } from 'react';
import { clamp } from '../utils/math';

interface MeterProps {
  meter: number;
}

const Meter: FC<MeterProps> = ({ meter }) => {
  return (
    <div className="absolute w-full top-1/4 bottom-1/4 rounded-full opacity-50 overflow-hidden flex">
      <div
        className="h-full bg-lime-600 transition-all origin-left animate-push"
        style={{ width: `${clamp(meter * 5, 0, 50)}%` }}
      />
      <div
        className="h-full bg-yellow-500 transition-all origin-left animate-push"
        style={{ width: `${clamp(meter * 5 - 50, 0, 30)}%` }}
      />
      <div
        className="h-full bg-orange-600 transition-all origin-left animate-push"
        style={{ width: `${clamp(meter * 5 - 80, 0, 15)}%` }}
      />
      <div
        className="h-full bg-red-600 transition-all origin-left animate-push"
        style={{ width: `${clamp(meter * 5 - 95, 0, 5)}%` }}
      />
    </div>
  );
};

export default Meter;
