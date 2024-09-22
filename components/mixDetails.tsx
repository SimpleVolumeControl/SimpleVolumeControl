'use client';

import { FC } from 'react';
import useMix from '../hooks/useMix';
import ChannelStrip from './channelStrip';
import { b64Decode } from '../common/b64';
import { useTranslations } from 'next-intl';

interface MixDetailsProps {
  // The identifier of the mix of which the details should be shown.
  mixId: string;
}

/**
 * This component contains all details of a mix.
 * This includes the title, the main channel strip for the mix itself,
 * as well as channel strips for all configured individual inputs of the mix.
 */
const MixDetails: FC<MixDetailsProps> = ({ mixId }) => {
  const t = useTranslations('Mix');
  // Utilize the useMix hook for the communication with the server.
  const { mix, inputs, meters, sendMute, sendLevel } = useMix(mixId);

  // A helper function to get the actual value for a certain position in the base64 encoded meters string.
  const getMeterValue = (index: number) =>
    Math.max(0, b64Decode(meters.charAt(index)));

  return (
    <div className="container mx-auto">
      {mix && (
        <>
          <div className="prose">
            <h1>{mix.name}</h1>
          </div>
          <ChannelStrip
            {...mix}
            name={`${mix.name} (${t('overallVolume')})`}
            highlight={true}
            sendMute={(value) => sendMute('', value)}
            sendLevel={(value) => sendLevel('', value)}
            meter={getMeterValue(0)}
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
          meter={getMeterValue(idx + 1)}
        />
      ))}
    </div>
  );
};

export default MixDetails;
