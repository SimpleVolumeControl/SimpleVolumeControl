import { FC, FormEvent, useEffect, useState } from 'react';
import MixAssignment from '../../model/mixAssignment';
import { getAllInputs } from '../../common/mixerProperties';
import { useTranslations } from 'next-intl';

interface MixAssignmentCardProps {
  mix: MixAssignment;
  first: boolean;
  last: boolean;
  move: (input: string | null, up: boolean) => void;
  remove: (input: string | null) => void;
  add: (name: string) => void;
  mixer: string;
}

const MixAssignmentCard: FC<MixAssignmentCardProps> = ({
  mix,
  first,
  last,
  move,
  remove,
  add,
  mixer,
}) => {
  const t = useTranslations('ConfigEditor');
  const [addName, setAddName] = useState('');
  const [inputs, setInputs] = useState<string[]>(mix.inputs);
  useEffect(() => {
    if (mix.inputs !== null && mix.inputs !== undefined) {
      setInputs(mix.inputs);
    }
  }, [mix]);
  useEffect(() => {
    setAddName(
      getAllInputs(mixer).find((input) => !inputs.includes(input)) ?? '',
    );
  }, [mixer, inputs]);

  return (
    <div className="card w-full bg-base-200 shadow-xl">
      <div className="card-body flex-row">
        <div className="card-actions justify-between flex-col mr-4">
          <button
            className={`btn btn-square btn-outline btn-sm ${
              first ? 'invisible' : ''
            }`}
            onClick={() => move(null, true)}
          >
            <span className="rotate-90">&lt;</span>
          </button>
          <button
            className="btn btn-square btn-outline btn-sm"
            onClick={() => remove(null)}
          >
            ×
          </button>
          <button
            className={`btn btn-square btn-outline btn-sm ${
              last ? 'invisible' : ''
            }`}
            onClick={() => move(null, false)}
          >
            <span className="rotate-90">&gt;</span>
          </button>
        </div>
        <div className="grow">
          <h2 className="card-title">{mix.mix}</h2>
          <div className="flex gap-2 my-4">
            {inputs.map((input, index) => (
              <div key={input} className="bg-base-300 p-1 rounded-sm">
                <span className="px-1">{input}</span>
                {index !== 0 && (
                  <button
                    className="btn btn-ghost btn-xs btn-circle"
                    onClick={() => move(input, true)}
                  >
                    &lt;
                  </button>
                )}
                <button
                  className="btn btn-ghost btn-xs btn-circle"
                  onClick={() => remove(input)}
                >
                  ×
                </button>
                {index !== inputs.length - 1 && (
                  <button
                    className="btn btn-ghost btn-xs btn-circle"
                    onClick={() => move(input, false)}
                  >
                    &gt;
                  </button>
                )}
              </div>
            ))}
          </div>
          <div>
            <hr className="border-base-300 my-2" />

            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                add(addName);
                setAddName('');
              }}
            >
              <label className="flex gap-2 flex-wrap">
                <span className="label">{t('MixesConfig.addInput')}</span>
                <select
                  className="select select-bordered select-sm w-auto"
                  onChange={(event) => setAddName(event.target.value)}
                  value={addName}
                >
                  {getAllInputs(mixer).map((input) => (
                    <option key={input} disabled={inputs.includes(input)}>
                      {input}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-sm btn-neutral">
                  {t('MixesConfig.add')}
                </button>
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixAssignmentCard;
