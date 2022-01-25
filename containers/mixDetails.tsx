import { FC, useEffect, useState } from 'react';
import useAuthenticatedWebsocket from './useAuthenticatedWebsocket';
import useMix from './useMix';
import ChannelStrip from '../components/channelStrip';
import ApiCode from '../common/apiCode';

interface MixDetailsProps {
  mixId: string;
}

const MixDetails: FC<MixDetailsProps> = ({ mixId }) => {
  const { lastMessage, sendMessage } = useAuthenticatedWebsocket(
    `mix/${mixId}`,
  );
  const { mix, inputs } = useMix(lastMessage?.data);
  const [sendMute, setSendMute] = useState(
    () => (id: string, value: boolean) => {},
  );
  const [sendLevel, setSendLevel] = useState(
    () => (id: string, value: number) => {},
  );
  useEffect(() => {
    setSendMute(
      () => (id: string, value: boolean) =>
        sendMessage(`${ApiCode.MUTE}${id}/${value}`),
    );
    setSendLevel(
      () => (id: string, value: number) =>
        sendMessage(`${ApiCode.LEVEL}${id}/${value}`),
    );
  }, [sendMessage]);

  return (
    <div className="container mx-auto">
      {mix && (
        <ChannelStrip
          {...mix}
          highlight={true}
          sendMute={(value) => sendMute('', value)}
          sendLevel={(value) => sendLevel('', value)}
        />
      )}
      <hr className={'border-base-content/50 my-8'} />
      {inputs.map((input) => (
        <ChannelStrip
          key={input.id}
          {...input}
          sendMute={(value) => sendMute(input.id, value)}
          sendLevel={(value) => sendLevel(input.id, value)}
        />
      ))}
    </div>
  );
};

export default MixDetails;
