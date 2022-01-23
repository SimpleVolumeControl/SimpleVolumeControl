import { FC } from 'react';
import useAuthenticatedWebsocket from './useAuthenticatedWebsocket';
import MixTile from '../components/mixTile';
import useMixes from './useMixes';

interface MixOverviewProps {}

const MixOverview: FC<MixOverviewProps> = () => {
  const { lastMessage } = useAuthenticatedWebsocket('mixes');
  const mixes = useMixes(lastMessage?.data);

  return (
    <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
      {mixes.map((mix) => (
        <MixTile key={mix.id} {...mix} />
      ))}
    </div>
  );
};

export default MixOverview;
