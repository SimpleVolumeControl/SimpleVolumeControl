import { FC } from 'react';
import useMix from '../hooks/useMix';
import ChannelStrip from './channelStrip';

interface MixDetailsProps {
  mixId: string;
}

const MixDetails: FC<MixDetailsProps> = ({ mixId }) => {
  const { mix, inputs, sendMute, sendLevel } = useMix(mixId);

  return (
    <div className="container mx-auto">
      {mix && (
        <>
          <div className="prose">
            <h1>{mix.name}</h1>
          </div>
          <ChannelStrip
            {...mix}
            name={`${mix.name} (Gesamtlautstärke)`}
            highlight={true}
            sendMute={(value) => sendMute('', value)}
            sendLevel={(value) => sendLevel('', value)}
            meterIndex={0}
          />
        </>
      )}
      <hr className={'border-base-content/50 my-8'} />
      {inputs.map((input, idx) => (
        <ChannelStrip
          key={input.id}
          {...input}
          sendMute={(value) => sendMute(input.id, value)}
          sendLevel={(value) => sendLevel(input.id, value)}
          meterIndex={idx + 1}
        />
      ))}
    </div>
  );
};

export default MixDetails;
