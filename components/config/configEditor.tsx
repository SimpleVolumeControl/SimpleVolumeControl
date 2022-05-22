import { FC } from 'react';
import useConfig from '../../hooks/useConfig';
import Link from 'next/link';
import NetworkConfig from './networkConfig';
import MixerConfig from './mixerConfig';
import MixesConfig from './mixesConfig';
import PasswordConfig from './passwordConfig';
import Tabs from '../tabs';

interface ConfigEditorProps {}

enum ConfigTabs {
  NETWORK,
  MIXER,
  MIXES,
  PASSWORD,
}

/**
 * This component allows to edit the configuration of the SimpleVolumeControl instance.
 * It allows to set the mixer type, the IP address of the mixer, the inputs per mix and the password.
 */
const ConfigEditor: FC<ConfigEditorProps> = () => {
  // Utilize the useConfig hook for the communication with the server.
  const { config, changeConfig } = useConfig();

  return (
    <div className="container mx-auto">
      <div className="prose">
        <h1>Konfigurationseditor</h1>
      </div>
      <div className="alert border-8 bg-warning/10 border-warning shadow-lg my-4">
        <div className="block">
          <h2 className="font-bold text-xl mb-2">
            Achtung: Erweiterte Einstellungen
          </h2>
          <p className="mb-4">
            Diese Einstellungen sollten nur von fachkundigen Personen bearbeitet
            werden. Falsche Einstellungen können dazu führen, dass
            SimpleVolumeControl nicht mehr richtig funktioniert.
          </p>
          <Link href="/">
            <a className="btn btn-outline btn-lg">Zurück zur Raumübersicht</a>
          </Link>
        </div>
      </div>
      <Tabs
        tabs={[
          {
            id: ConfigTabs.NETWORK,
            title: 'Netzwerk',
            content: (
              <NetworkConfig config={config} changeConfig={changeConfig} />
            ),
          },
          {
            id: ConfigTabs.MIXER,
            title: 'Mischpult',
            content: (
              <MixerConfig config={config} changeConfig={changeConfig} />
            ),
          },
          {
            id: ConfigTabs.MIXES,
            title: 'Räume',
            content: (
              <MixesConfig config={config} changeConfig={changeConfig} />
            ),
          },
          {
            id: ConfigTabs.PASSWORD,
            title: 'Kennwort',
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
