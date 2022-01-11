import { FC } from 'react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { passwordState } from '../containers/sessionProvider';
import { useRouter } from 'next/router';

interface HeaderProps {
  isHome: boolean;
}

const Header: FC<HeaderProps> = ({ isHome }) => {
  const [password, setPassword] = useRecoilState(passwordState);
  const router = useRouter();
  return (
    <>
      <div className="navbar mb-4 shadow-lg bg-primary text-neutral-content rounded-box flex-wrap xs:flex-nowrap">
        <div className="navbar-start">
          {!isHome && (
            <div className="btn btn-outline btn-accent">
              <Link href="/">zurück</Link>
            </div>
          )}
        </div>
        <div className="px-2 mx-2 navbar-center w-full xs:w-auto order-first xs:order-none justify-center">
          <span className="text-lg sm:text-3xl sm:font-thin">
            SimpleVolumeControl
          </span>
        </div>
        <div className="navbar-end">
          {password !== '' && (
            <button
              onClick={() => {
                setPassword('');
                router.push('/login').then();
              }}
              className="btn btn-outline btn-accent"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
