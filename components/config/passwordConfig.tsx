import NullableConfig from '../../model/nullableConfig';
import { FC, FormEvent, useState } from 'react';
import { hash } from '../../hooks/useLogin';

interface PasswordConfigProps {
  config: NullableConfig;
  changeConfig: (config: NullableConfig) => void;
}

const PasswordConfig: FC<PasswordConfigProps> = ({ changeConfig }) => {
  const [input, setInput] = useState('');
  const [repeat, setRepeat] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (input === repeat) {
      changeConfig({ password: hash(input) });
    } else {
      alert('Eingaben stimmen nicht überein.');
    }
    setInput('');
    setRepeat('');
  };

  // The info icon is taken from the Bootstrap Icons library,
  // which is created by the Bootstrap Authors and licensed under the MIT License.
  return (
    <div>
      <div className="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="text-info flex-shrink-0 w-6 h-6"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
        <div className="block space-y-2 text-justify">
          <p>
            Das Kennwort bietet, insbesondere dann, wenn auf die Verwendung von
            HTTPS verzichtet wird, keinen sicheren Zugriffsschutz. Es handelt
            sich eher um einen Schutz gegen versehentliche Verwendung, der von
            bösartigen Akteuren überwunden werden kann. Aus diesem Grund ist es
            zwingend erforderlich, dass SimpleVolumeControl nur in sicheren
            lokalen Netzen verwendet wird, zu denen nur vertrauenswürdige
            Parteien Zugang haben.
          </p>
          <p>
            Es werden grundlegende Maßnahmen ergriffen, die es einem rein
            lesenden Angreifer erschweren, Rückschlüsse auf das verwendete
            Kennwort zu ziehen. Trotzdem sollte das Kennwort, das für
            SimpleVolumeControl verwendet wird, für keine anderen Dienste
            verwendet werden.
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-2">
        <div className="form-control">
          <label>
            <div className="label">
              <span className="label-text">Kennwort</span>
            </div>
            <div className="flex">
              <input
                type="password"
                placeholder="Kennwort"
                className="input input-bordered"
                onChange={(event) => setInput(event.target.value)}
                value={input}
              />
            </div>
          </label>
        </div>
        <div className="form-control">
          <label>
            <div className="label">
              <span className="label-text">Kennwort wiederholen</span>
            </div>
            <div className="flex">
              <input
                type="password"
                placeholder="Kennwort wiederholen"
                className="input input-bordered"
                onChange={(event) => setRepeat(event.target.value)}
                value={repeat}
              />
            </div>
          </label>
        </div>
        <button type="submit" className="btn">
          Speichern
        </button>
      </form>
    </div>
  );
};

export default PasswordConfig;
