import '../styles/globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import Header from '../components/header';
import { Provider as JotaiProvider } from 'jotai';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Footer from '../components/Footer';

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

  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <JotaiProvider>
            <Header title={title} />
            {children}
            <Footer />
            <div id="keyboard-container" />
          </JotaiProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'SimpleVolumeControl',
};
