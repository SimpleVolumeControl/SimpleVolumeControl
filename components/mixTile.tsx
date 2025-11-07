import { FC } from 'react';
import Link from 'next/link';
import useColor from '../hooks/useColor';

interface MixTileProps {
  // The identifier of the mix.
  id: string;

  // The name/description of the mix.
  name: string;

  // The color of the mix as a string (color name).
  // It corresponds to one of the available colors in the actual mixing consoles.
  color: string;
}

/**
 * This component provides a tile that shows the color and name of a mix.
 * When clicked, it redirects to the details page for the respective mix.
 */
const MixTile: FC<MixTileProps> = ({ id, name, color }) => {
  // Translate the color code to TailwindCSS color classes.
  const colorClasses = useColor(color);

  return (
    <div
      key={id}
      className={`card shadow-sm bg-base-100 border-2 ${colorClasses.border}`}
    >
      <Link href={`/mix/${id}`} passHref>
        <div className={`card-body ${colorClasses.bgFaint}`}>
          <h2 className="card-title m-0 justify-center">{name}</h2>
        </div>
      </Link>
    </div>
  );
};

export default MixTile;
