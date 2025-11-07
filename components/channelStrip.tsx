import { FC } from 'react';
import MuteButton from './muteButton';
import Meter from './meter';
import Fader from './fader';
import useColor from '../hooks/useColor';

interface ChannelStripProps {
  // Indicates if the channel strip should be highlighted.
  highlight?: boolean;

  // The identifier corresponding to the channel strip.
  id: string;

  // The name of this channel.
  name: string;

  // The color of this channel.
  color: string;

  // Indicates if this channel is muted.
  mute: boolean;

  // The level of this channel as a number between 0 and 1.
  level: number;

  // A function that gets called when a mute status change is initiated.
  // It receives the new mute status as an argument.
  sendMute: (value: boolean) => void;

  // A function that gets called when a level change is initiated.
  // It receives the new level as a number between 0 and 1.
  sendLevel: (value: number) => void;

  // The current meter value of this channel.
  // Currently expressed as an integer in the range of 0 to 20, but this might change in the future.
  meter: number;
}

/**
 * This component contains all controls and information for a single channel/mix.
 * It is the equivalent of a channel strip on an actual mixing console.
 */
const ChannelStrip: FC<ChannelStripProps> = ({
  highlight,
  id,
  name,
  color,
  mute,
  level,
  sendMute,
  sendLevel,
  meter,
}) => {
  const colorClasses = useColor(color);
  return (
    <div
      key={id}
      className={`card my-4 shadow-sm bg-base-100 border-2 ${colorClasses.border}`}
    >
      <div className={`card-body p-4 ${highlight ? colorClasses.bgFaint : ''}`}>
        <div className="flex items-center mb-2">
          <h2 className="card-title m-0 text-base flex-1">
            {name}{' '}
            <span
              className={`badge ${colorClasses.bg} text-neutral-content border-0`}
            >
              {Math.round(level * 100)}%
            </span>
          </h2>
          <MuteButton sendMute={sendMute} mute={mute} />
        </div>
        <div className="relative leading-0">
          <Meter meter={meter} />
          <Fader level={level} sendLevel={sendLevel} />
        </div>
      </div>
    </div>
  );
};

export default ChannelStrip;
