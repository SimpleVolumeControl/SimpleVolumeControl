import { FC } from 'react';
import { clamp } from '../utils/math';

interface MeterProps {
  // The meter value to be displayed.
  // Currently expressed as an integer in the range of 0 to 20, but this might change in the future.
  meter: number;
}

/**
 * This component shows the current meter level, similar to the LEDs on an actual mixing console.
 * The first 50% are colored in green,
 * 50% to 80% in yellow,
 * 80% to 95% in orange and
 * 95% to 100% in red (clipping).
 * The displayed value shows a slight animation so that this meter appears dynamic to the user,
 * even though actual value updates might only occur less often.
 */
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
