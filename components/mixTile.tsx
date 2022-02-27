import { FC } from 'react';
import Link from 'next/link';
import useColor from '../hooks/useColor';

interface MixTileProps {
  id: string;
  name: string;
  color: string;
}

const MixTile: FC<MixTileProps> = ({ id, name, color }) => {
  const colorClasses = useColor(color);
  return (
    <div
      key={id}
      className={`card shadow bg-base-100 border-2 ${colorClasses.border}`}
    >
      <Link href={`/mix/${id}`} passHref>
        <a>
          <div className={`card-body ${colorClasses.bgFaint}`}>
            <h2 className="card-title m-0 justify-center">{name}</h2>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default MixTile;
