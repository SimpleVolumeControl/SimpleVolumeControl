import { FC } from 'react';
import MixTile from './mixTile';
import useMixes from '../hooks/useMixes';

interface MixOverviewProps {}

const MixOverview: FC<MixOverviewProps> = () => {
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
