import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { metersState } from '../containers/useMix';
import { b64Decode } from '../common/b64';
import { clamp } from '../utils/math';

interface ChannelStripProps {
  highlight?: boolean;
  id: string;
  name: string;
  color: string;
  mute: boolean;
  level: number;
  sendMute: (value: boolean) => void;
  sendLevel: (value: number) => void;
  meterIndex: number;
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'green':
      return {
        bg: 'bg-lime-500/20',
        border: 'border-lime-500',
        badge: 'bg-lime-700',
      };
    case 'lightblue':
      return {
        bg: 'bg-cyan-400/20',
        border: 'border-cyan-400',
        badge: 'bg-cyan-600',
      };
    case 'blue':
      return {
        bg: 'bg-blue-500/20',
        border: 'border-blue-500',
        badge: 'bg-blue-700',
      };
    case 'pink':
      return {
        bg: 'bg-pink-500/20',
        border: 'border-pink-500',
        badge: 'bg-pink-700',
      };
    case 'red':
      return {
        bg: 'bg-red-500/20',
        border: 'border-red-500',
        badge: 'bg-red-700',
      };
    case 'yellow':
      return {
        bg: 'bg-yellow-400/20',
        border: 'border-yellow-400',
        badge: 'bg-yellow-600',
      };
    default:
      return {
        bg: 'bg-base-300/20',
        border: 'border-base-300',
        badge: 'bg-base-500',
      };
  }
};

const ChannelStrip: FC<ChannelStripProps> = ({
  highlight,
  id,
  name,
  color,
  mute,
  level,
  sendMute,
  sendLevel,
  meterIndex,
}) => {
  const colorClasses = getColorClasses(color);
  const meters = useRecoilValue(metersState);
  const meter = Math.max(0, b64Decode(meters.charAt(meterIndex)));
  return (
    <div
      key={id}
      className={`card my-4 shadow bg-base-100 border-2 ${colorClasses.border}`}
    >
      <div className={`card-body p-4 ${highlight ? colorClasses.bg : ''}`}>
        <div className="flex items-center mb-2">
          <h2 className="card-title m-0 text-base flex-1">
            {name}{' '}
            <span className={`badge ${colorClasses.badge} border-0`}>
              {Math.round(level * 100)}%
            </span>
          </h2>
          <button
            className={`btn btn-md btn-error btn-square ${
              mute ? '' : 'btn-outline'
            }`}
            onClick={() => sendMute(!mute)}
          >
            Mute
          </button>
        </div>
        <div className="relative leading-[0]">
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
        </div>
      </div>
    </div>
  );
};

export default ChannelStrip;
