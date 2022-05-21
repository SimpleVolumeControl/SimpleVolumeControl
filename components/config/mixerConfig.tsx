import NullableConfig from '../../model/nullableConfig';
import { FC, FormEvent, useEffect, useState } from 'react';
import { getAvailableMixers } from '../../common/mixerProperties';

interface MixerConfigProps {
  config: NullableConfig;
  changeConfig: (config: NullableConfig) => void;
}

const MixerConfig: FC<MixerConfigProps> = ({ config, changeConfig }) => {
  const [input, setInput] = useState(config.mixer ?? '');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    changeConfig({ mixer: input });
  };
  useEffect(() => {
    if (config.mixer !== null && config.mixer !== undefined) {
      setInput(config.mixer);
    }
  }, [config]);

  return (
    <div>
      <form onSubmit={submit} className="flex">
        <div className="form-control">
          <label>
            <div className="label">
              <span className="label-text">Mischpulttyp</span>
            </div>
            <div className="flex space-x-2">
              <select
                className="select select-bordered"
                onChange={(event) => setInput(event.target.value)}
                value={input}
              >
                {getAvailableMixers().map((mixer) => (
                  <option key={mixer}>{mixer}</option>
                ))}
              </select>
              <button type="submit" className="btn">
                Speichern
              </button>
            </div>
          </label>
        </div>
      </form>
    </div>
  );
};

export default MixerConfig;
