import '../styles/globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'SimpleVolumeControl',
};