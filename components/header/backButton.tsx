'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const BackButton: FC = () => {
  const pathname = usePathname();

  return pathname !== '/' && pathname !== '/login' ? (
    <Link href="/" className="btn btn-outline btn-accent h-full">
      zurück
    </Link>
  ) : null;
};

export default BackButton;
