import { FC } from 'react';
import Link from 'next/link';
import { useSetRecoilState } from 'recoil';
import { passwordState } from '../containers/sessionProvider';

interface HeaderProps {
  isHome: boolean;
  hideLogout?: boolean;
}

const Header: FC<HeaderProps> = ({ isHome, hideLogout }) => {
  const setPassword = useSetRecoilState(passwordState);
  return (
    <>
      {!isHome && (
        <div>
          <Link href="/">zurück</Link>
        </div>
      )}
      <div>SimpleVolumeControl</div>
      {!hideLogout && <button onClick={() => setPassword('')}>Logout</button>}
    </>
  );
};

export default Header;
