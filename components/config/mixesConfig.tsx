import NullableConfig from '../../model/nullableConfig';
import { FC, FormEvent, useEffect, useState } from 'react';
import MixAssignment from '../../model/mixAssignment';
import MixAssignmentCard from './mixAssignmentCard';
import { arrayMoveItemDown, arrayMoveItemUp } from '../../utils/arrayMoveItem';
import { getAllMixes } from '../../common/mixerProperties';

interface MixesConfigProps {
  config: NullableConfig;
  changeConfig: (config: NullableConfig) => void;
}

const MixesConfig: FC<MixesConfigProps> = ({ config, changeConfig }) => {
  const [mixes, setMixes] = useState<MixAssignment[]>(config.mixes ?? []);
  const [changed, setChanged] = useState(false);
  const [mixer, setMixer] = useState(config.mixer ?? '');
  const [addName, setAddName] = useState('');
  useEffect(() => {
    if (!changed && config.mixes !== null && config.mixes !== undefined) {
      setMixes(config.mixes);
    }
  }, [config, changed]);
  useEffect(() => {
    if (config.mixer !== null && config.mixer !== undefined) {
      setMixer(config.mixer);
    }
  }, [config]);
  const submit = () => {
    changeConfig({ mixes: mixes });
    setChanged(false);
  };
  const getMoveFunc = (index: number) => {
    return (input: string | null = null, up: boolean) => {
      const moveItem = up ? arrayMoveItemUp : arrayMoveItemDown;
      if (input === null) {
        setMixes((mixes) => moveItem(mixes, index));
        setChanged(true);
      } else {
        const inputIndex = mixes[index].inputs.findIndex(
          (item) => item === input,
        );
        if (inputIndex >= 0) {
          setMixes((mixes) => {
            mixes[index] = {
              mix: mixes[index].mix,
              inputs: moveItem(mixes[index].inputs, inputIndex),
            };
            return [...mixes];
          });
          setChanged(true);
        }
      }
    };
  };
  const getRemoveFunc = (index: number) => {
    return (input: string | null = null) => {
      if (input === null) {
        mixes.splice(index, 1);
        setMixes((mixes) => [...mixes]);
        setChanged(true);
      } else {
        setMixes((mixes) => {
          mixes[index] = {
            mix: mixes[index].mix,
            inputs: mixes[index].inputs.filter((item) => item !== input),
          };
          return [...mixes];
        });
        setChanged(true);
      }
    };
  };
  const getAddFunc = (index: number | null = null) => {
    return (name: string) => {
      if (index === null) {
        setMixes((mixes) => [...mixes, { mix: name, inputs: [] }]);
        setChanged(true);
      } else {
        setMixes((mixes) => {
          mixes[index] = {
            mix: mixes[index].mix,
            inputs: [...mixes[index].inputs, name],
          };
          return [...mixes];
        });
        setChanged(true);
      }
    };
  };

  return (
    <div>
      <div className="mb-8 space-y-8">
        {mixes.map((mix, index) => (
          <MixAssignmentCard
            key={mix.mix}
            mix={mix}
            first={index === 0}
            last={index === mixes.length - 1}
            move={getMoveFunc(index)}
            remove={getRemoveFunc(index)}
            add={getAddFunc(index)}
            mixer={mixer}
          />
        ))}
        <div className="card w-full shadow-xl card-compact border-base-200 border border-dashed border-4">
          <div className="card-body">
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                getAddFunc()(addName);
                setAddName('');
              }}
              className="flex"
            >
              <div className="form-control">
                <label>
                  <div className="label">
                    <span className="label-text">Raum hinzufügen:</span>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      className="select select-bordered select-sm"
                      onChange={(event) => setAddName(event.target.value)}
                      value={addName}
                    >
                      {getAllMixes(mixer).map((mix) => (
                        <option
                          key={mix}
                          disabled={mixes.some(
                            (mixAssignment) => mixAssignment.mix === mix,
                          )}
                        >
                          {mix}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-sm btn-neutral">
                      Hinzufügen
                    </button>
                  </div>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-neutral" onClick={submit}>
        Speichern
      </button>
    </div>
  );
};

export default MixesConfig;
