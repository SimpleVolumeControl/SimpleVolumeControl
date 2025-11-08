'use client';

import { FC } from 'react';
import useConfig from '../../hooks/useConfig';
import Link from 'next/link';
import GeneralConfig from './generalConfig';
import MixerConfig from './mixerConfig';
import MixesConfig from './mixesConfig';
import PasswordConfig from './passwordConfig';
import Tabs from '../tabs';
import { useTranslations } from 'next-intl';

enum ConfigTabs {
  GENERAL,
  MIXER,
  MIXES,
  PASSWORD,
}

/**
 * This component allows to edit the configuration of the SimpleVolumeControl instance.
 * It allows to set the mixer type, the IP address of the mixer, the inputs per mix and the password.
 */
const ConfigEditor: FC = () => {
  const t = useTranslations('ConfigEditor');

  // Utilize the useConfig hook for the communication with the server.
  const { config, changeConfig } = useConfig();

  return (
    <div className="container mx-auto">
      <div className="prose">
        <h1>{t('configEditor')}</h1>
      </div>
      <div className="alert border-8 bg-warning/10 border-warning shadow-lg my-4">
        <div className="block">
          <h2 className="font-bold text-xl mb-2">{t('Warning.title')}</h2>
          <p className="mb-4">{t('Warning.body')}</p>
          <Link href="/" className="btn btn-outline btn-lg">
            {t('Warning.backlink')}
          </Link>
        </div>
      </div>
      <Tabs
        tabs={[
          {
            id: ConfigTabs.GENERAL,
            title: t('Tabs.general'),
            content: (
              <GeneralConfig config={config} changeConfig={changeConfig} />
            ),
          },
          {
            id: ConfigTabs.MIXER,
            title: t('Tabs.mixer'),
            content: (
              <MixerConfig config={config} changeConfig={changeConfig} />
            ),
          },
          {
            id: ConfigTabs.MIXES,
            title: t('Tabs.mixes'),
            content: (
              <MixesConfig config={config} changeConfig={changeConfig} />
            ),
          },
          {
            id: ConfigTabs.PASSWORD,
            title: t('Tabs.password'),
            content: (
              <PasswordConfig config={config} changeConfig={changeConfig} />
            ),
          },
        ]}
      />
    </div>
  );
};

export default ConfigEditor;
