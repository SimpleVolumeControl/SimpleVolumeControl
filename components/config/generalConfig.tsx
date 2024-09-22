import NullableConfig from '../../model/nullableConfig';
import { FC, FormEvent, useEffect, useState } from 'react';
import TextInput from '../textInput';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface GeneralConfigProps {
  config: NullableConfig;
  changeConfig: (config: NullableConfig) => void;
}

const GeneralConfig: FC<GeneralConfigProps> = ({ config, changeConfig }) => {
  const t = useTranslations('ConfigEditor');
  const [input, setInput] = useState(config.title ?? '');
  const router = useRouter();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    changeConfig({ title: input });
    router.refresh(); // Refresh in order to update the title.
  };
  useEffect(() => {
    if (config.title !== null && config.title !== undefined) {
      setInput(config.title);
    }
  }, [config]);

  return (
    <div>
      <form onSubmit={submit} className="flex">
        <div className="form-control">
          <label>
            <div className="label">
              <span className="label-text">
                {t('GeneralConfig.titleLabel')}
              </span>
            </div>
            <div className="flex space-x-2">
              <TextInput
                className="w-full input input-bordered"
                placeholder={t('GeneralConfig.titleLabel')}
                onChange={(newValue) => setInput(newValue)}
                value={input}
              />
              <button type="submit" className="btn btn-neutral">
                {t('save')}
              </button>
            </div>
          </label>
        </div>
      </form>
    </div>
  );
};

export default GeneralConfig;
