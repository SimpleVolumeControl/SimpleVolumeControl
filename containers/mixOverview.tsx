import { FC, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Link from 'next/link';

interface MixOverviewProps {}

const MixOverview: FC<MixOverviewProps> = () => {
  // TODO Move websocket handling to custom hook
  const [url, setUrl] = useState(() => () => new Promise<string>(() => {}));
  useEffect(() => {
    const { protocol, host } = window.location;
    setUrl(
      () => () =>
        Promise.resolve(
          `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}/api/mixes`,
        ),
    );
  }, []);
  const { sendMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket(url);

  return (
    <div>
      {lastJsonMessage?.map((mix: any) => (
        <div key={mix?.id}>
          <Link href={`/mix/${mix?.id}`}>{mix?.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default MixOverview;
