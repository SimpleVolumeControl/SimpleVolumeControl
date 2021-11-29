import { FC } from 'react';
import Link from 'next/link';
import useAuthenticatedWebsocket from './useAuthenticatedWebsocket';

interface MixOverviewProps {}

const MixOverview: FC<MixOverviewProps> = () => {
  const { lastMessage } = useAuthenticatedWebsocket('mixes');
  const lastJsonMessage = (() => {
    try {
      return JSON.parse(lastMessage?.data);
    } catch (e) {
      return [];
    }
  })();

  return (
    <div>
      {lastJsonMessage?.map?.((mix: any) => (
        <div key={mix?.id}>
          <Link href={`/mix/${mix?.id}`}>{mix?.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default MixOverview;
