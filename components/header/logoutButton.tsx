'use client';

import { FC } from 'react';
import useLogin from '../../hooks/useLogin';
import { useTranslations } from 'next-intl';

const LogoutButton: FC = () => {
  const { logout, isLoggedIn } = useLogin();
  const t = useTranslations('Header');

  return isLoggedIn ? (
    <button onClick={logout} className="btn btn-outline btn-accent h-full">
      {t('logout')}
    </button>
  ) : null;
};

export default LogoutButton;
