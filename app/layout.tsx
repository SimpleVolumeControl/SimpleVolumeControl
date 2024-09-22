import '../styles/globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import Header from '../components/header';
import { Provider as JotaiProvider } from 'jotai';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const response = await fetch(
    `http://localhost:${process.env.PORT || 3000}/api/title`,
    { cache: 'no-store' },
  );

  const title = (await response.text()) || undefined;

  return (
    <html>
      <body>
        <JotaiProvider>
          <Header title={title} />
          {children}
          <div id="keyboard-container" />
        </JotaiProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'SimpleVolumeControl',
};
