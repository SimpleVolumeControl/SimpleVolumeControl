import { FC } from 'react';
import MixTile from './mixTile';
import useMixes from '../hooks/useMixes';

interface MixOverviewProps {}

/**
 * This component provides an overview over all configured mixes.
 * It displays them as tiles which lead to the respective details views when clicked.
 */
const MixOverview: FC<MixOverviewProps> = () => {
  // Utilize the useMixes hook for the communication with the server.
  const mixes = useMixes();

  return (
    <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
      {mixes.map((mix) => (
        <MixTile key={mix.id} {...mix} />
      ))}
    </div>
  );
};

export default MixOverview;
