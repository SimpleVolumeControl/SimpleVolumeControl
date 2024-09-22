import NullableConfig from '../../model/nullableConfig';
import { FC, FormEvent, useEffect, useState } from 'react';
import { getAvailableMixers } from '../../common/mixerProperties';
import TextInput from '../textInput';

interface MixerConfigProps {
  config: NullableConfig;
  changeConfig: (config: NullableConfig) => void;
}

const MixerConfig: FC<MixerConfigProps> = ({ config, changeConfig }) => {
  const [ipInput, setIpInput] = useState(config.ip ?? '');
  const [mixerInput, setMixerInput] = useState(config.mixer ?? '');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    changeConfig({ ip: ipInput, mixer: mixerInput });
  };
  useEffect(() => {
    if (config.ip !== null && config.ip !== undefined) {
      setIpInput(config.ip);
    }
    if (config.mixer !== null && config.mixer !== undefined) {
      setMixerInput(config.mixer);
    }
  }, [config]);

  return (
    <div>
      <form onSubmit={submit} className="space-y-2">
        <div className="form-control">
          <label>
            <div className="label">
              <span className="label-text">IP-Adresse des Mischpults</span>
            </div>
            <TextInput
              placeholder="---.---.---.---"
              onChange={(newValue) => setIpInput(newValue)}
              value={ipInput}
            />
          </label>
        </div>
        <div className="form-control">
          <label>
            <div className="label">
              <span className="label-text">Mischpulttyp</span>
            </div>
            <select
              className="select select-bordered"
              onChange={(event) => setMixerInput(event.target.value)}
              value={mixerInput}
            >
              {getAvailableMixers().map((mixer) => (
                <option key={mixer}>{mixer}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-neutral">
          Speichern
        </button>
      </form>
    </div>
  );
};

export default MixerConfig;
