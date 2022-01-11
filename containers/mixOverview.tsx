import { FC } from 'react';
import useAuthenticatedWebsocket from './useAuthenticatedWebsocket';
import MixTile from '../components/mixTile';
import useMixes from './useMixes';

interface MixOverviewProps {}

const MixOverview: FC<MixOverviewProps> = () => {
  const { lastMessage } = useAuthenticatedWebsocket('mixes');
  const mixes = useMixes(lastMessage?.data);

  return (
    <div className="container mx-auto columns-3xs">
      {mixes.map((mix) => (
        <MixTile key={mix.id} {...mix} />
      ))}
    </div>
  );
};

export default MixOverview;
