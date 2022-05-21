import NullableConfig from '../../model/nullableConfig';
import { FC, FormEvent, useEffect, useState } from 'react';

interface NetworkConfigProps {
  config: NullableConfig;
  changeConfig: (config: NullableConfig) => void;
}

const NetworkConfig: FC<NetworkConfigProps> = ({ config, changeConfig }) => {
  const [input, setInput] = useState(config.ip ?? '');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    changeConfig({ ip: input });
  };
  useEffect(() => {
    if (config.ip !== null && config.ip !== undefined) {
      setInput(config.ip);
    }
  }, [config]);

  return (
    <div>
      <form onSubmit={submit} className="flex">
        <div className="form-control">
          <label>
            <div className="label">
              <span className="label-text">IP-Adresse des Mischpults</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="---.---.---.---"
                className="w-full input input-bordered"
                onChange={(event) => setInput(event.target.value)}
                value={input}
              />
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

export default NetworkConfig;
