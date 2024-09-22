import { FC } from 'react';
import LogoutButton from './logoutButton';
import BackButton from './backButton';

interface HeaderProps {
  title?: string;
}

/**
 * This component provides the header bar of the user interface.
 * It displays the name of the application and adjusts responsively to different screen widths.
 * If not used on a home page of the application,
 * a back button is displayed which can be used to navigate to the index page.
 * If currently logged in, a logout button is displayed.
 */
const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <>
      <div className="navbar mb-4 shadow-lg bg-primary text-neutral-content rounded-box flex-wrap xs:flex-nowrap items-stretch">
        <div className="navbar-start">
          <BackButton />
        </div>
        <div className="px-2 mx-2 navbar-center w-full xs:w-auto order-first xs:order-none justify-center flex-col">
          <span className="text-lg sm:text-3xl sm:font-light">
            SimpleVolumeControl
          </span>
          {title ? <span>{title}</span> : null}
        </div>
        <div className="navbar-end">
          <LogoutButton />
        </div>
      </div>
    </>
  );
};

export default Header;
