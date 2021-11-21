import { FC } from 'react';
import Link from 'next/link';

interface HeaderProps {
  isHome: boolean;
}

const Header: FC<HeaderProps> = ({ isHome }) => {
  return (
    <>
      {!isHome && (
        <div>
          <Link href="/">zurück</Link>
        </div>
      )}
      <div>SimpleVolumeControl</div>
    </>
  );
};

export default Header;
