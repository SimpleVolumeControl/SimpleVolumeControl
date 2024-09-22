'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const BackButton: FC = () => {
  const pathname = usePathname();
  const t = useTranslations('Header');

  return pathname !== '/' && pathname !== '/login' ? (
    <Link href="/" className="btn btn-outline btn-accent h-full">
      {t('back')}
    </Link>
  ) : null;
};

export default BackButton;
