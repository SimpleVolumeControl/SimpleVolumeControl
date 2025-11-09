import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { allLocales, defaultLocale } from './config';

async function getLocale() {
  const cookieLocale = (await cookies()).get('language')?.value;
  if (cookieLocale !== undefined && allLocales.includes(cookieLocale)) {
    return cookieLocale;
  }
  const headerLanguages = new Negotiator({
    headers: {
      'accept-language': (await headers()).get('accept-language') ?? undefined,
    },
  }).languages();
  try {
    return match(headerLanguages, allLocales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
