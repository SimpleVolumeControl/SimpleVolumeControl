import { FC } from 'react';
import Link from 'next/link';
import useLogin from '../hooks/useLogin';

interface HeaderProps {
  isHome: boolean;
}

const Header: FC<HeaderProps> = ({ isHome }) => {
  const { logout, isLoggedIn } = useLogin();
  return (
    <>
      <div className="navbar mb-4 shadow-lg bg-primary text-neutral-content rounded-box flex-wrap xs:flex-nowrap">
        <div className="navbar-start">
          {!isHome && (
            <Link href="/">
              <a className="btn btn-outline btn-accent">zurück</a>
            </Link>
          )}
        </div>
        <div className="px-2 mx-2 navbar-center w-full xs:w-auto order-first xs:order-none justify-center">
          <span className="text-lg sm:text-3xl sm:font-thin">
            SimpleVolumeControl
          </span>
        </div>
        <div className="navbar-end">
          {isLoggedIn && (
            <button onClick={logout} className="btn btn-outline btn-accent">
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
