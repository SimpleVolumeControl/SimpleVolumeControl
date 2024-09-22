'use client';

import { FC } from 'react';
import useLogin from '../../hooks/useLogin';

const LogoutButton: FC = () => {
  const { logout, isLoggedIn } = useLogin();

  return isLoggedIn ? (
    <button onClick={logout} className="btn btn-outline btn-accent h-full">
      Logout
    </button>
  ) : null;
};

export default LogoutButton;
