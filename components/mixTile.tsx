import { FC } from 'react';
import Link from 'next/link';

interface MixTileProps {
  id: string;
  name: string;
  color: string;
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'green':
      return { bg: 'bg-lime-500/20', border: 'border-lime-500' };
    case 'lightblue':
      return { bg: 'bg-cyan-400/20', border: 'border-cyan-400' };
    case 'blue':
      return { bg: 'bg-blue-500/20', border: 'border-blue-500' };
    case 'pink':
      return { bg: 'bg-pink-500/20', border: 'border-pink-500' };
    case 'red':
      return { bg: 'bg-red-500/20', border: 'border-red-500' };
    case 'yellow':
      return { bg: 'bg-yellow-400/20', border: 'border-yellow-400' };
    default:
      return { bg: 'bg-base-300/20', border: 'border-base-300' };
  }
};

const MixTile: FC<MixTileProps> = ({ id, name, color }) => {
  const colorClasses = getColorClasses(color);
  return (
    <div
      key={id}
      className={`card shadow bg-base-100 border-2 text-center ${colorClasses.border}`}
    >
      <Link href={`/mix/${id}`} passHref>
        <a>
          <div className={`card-body ${colorClasses.bg}`}>
            <h2 className="card-title m-0">{name}</h2>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default MixTile;
