import { FC } from 'react';
import Link from 'next/link';
import useLogin from '../hooks/useLogin';

interface HeaderProps {
  // Indicates if the current page is the home page of the application.
  isHome: boolean;
}

/**
 * This component provides the header bar of the user interface.
 * It displays the name of the application and adjusts responsively to different screen widths.
 * If not used on a home page of the application,
 * a back button is displayed which can be used to navigate to the index page.
 * If currently logged in, a logout button is displayed.
 */
const Header: FC<HeaderProps> = ({ isHome }) => {
  const { logout, isLoggedIn } = useLogin();
  return (
    <>
      <div className="navbar mb-4 shadow-lg bg-primary text-neutral-content rounded-box flex-wrap xs:flex-nowrap">
        <div className="navbar-start">
          {!isHome && (
            <Link href="/" className="btn btn-outline btn-accent">
              zurück
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
