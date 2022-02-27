import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { metersState } from '../hooks/useMix';
import { b64Decode } from '../common/b64';
import MuteButton from './muteButton';
import Meter from './meter';
import Fader from './fader';
import useColor from '../hooks/useColor';

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
  const colorClasses = useColor(color);
  const meters = useRecoilValue(metersState);
  const meter = Math.max(0, b64Decode(meters.charAt(meterIndex)));
  return (
    <div
      key={id}
      className={`card my-4 shadow bg-base-100 border-2 ${colorClasses.border}`}
    >
      <div className={`card-body p-4 ${highlight ? colorClasses.bgFaint : ''}`}>
        <div className="flex items-center mb-2">
          <h2 className="card-title m-0 text-base flex-1">
            {name}{' '}
            <span className={`badge ${colorClasses.bg} border-0`}>
              {Math.round(level * 100)}%
            </span>
          </h2>
          <MuteButton sendMute={sendMute} mute={mute} />
        </div>
        <div className="relative leading-[0]">
          <Meter meter={meter} />
          <Fader level={level} sendLevel={sendLevel} />
        </div>
      </div>
    </div>
  );
};

export default ChannelStrip;
