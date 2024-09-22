'use client';

import Link from 'next/link';
import { FC, useRef } from 'react';
import { useTranslations } from 'next-intl';
import cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { allLocales } from '../../i18n/config';

const Footer: FC = () => {
  const t = useTranslations('Footer');
  const languageDialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const click = (language?: string) => () => {
    if (language) {
      cookies.set('language', language, {
        secure: false,
        sameSite: 'Lax',
      });
    } else {
      cookies.remove('language', {
        secure: false,
        sameSite: 'Lax',
      });
    }
    languageDialogRef.current?.close();
    router.refresh();
  };

  return (
    <>
      <div className="container mx-auto mt-4 text-right">
        <a
          className="link link-hover"
          onClick={() => {
            languageDialogRef.current?.showModal();
          }}
        >
          {t('chooseLanguage')}
        </a>
        <span className="px-2">•</span>
        <Link href="/config" className="link link-hover">
          {t('settings')}
        </Link>
      </div>
      <dialog ref={languageDialogRef} className="modal">
        <div className="modal-box prose">
          <h2>{t('LanguageSelector.title')}</h2>
          <div className="space-y-5">
            <button className="btn btn-lg btn-block" onClick={click()}>
              {t('LanguageSelector.browserDefault')}
            </button>
            {allLocales.map((localeCode) => (
              <button
                key={localeCode}
                className="btn btn-lg btn-block"
                onClick={click(localeCode)}
              >
                {t(`LanguageSelector.${localeCode}`)}
              </button>
            ))}
          </div>
        </div>
        <div
          className="modal-backdrop"
          onClick={() => {
            languageDialogRef.current?.close();
          }}
        ></div>
      </dialog>
    </>
  );
};

export default Footer;
