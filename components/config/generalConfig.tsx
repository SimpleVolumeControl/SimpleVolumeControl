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
      <form onSubmit={submit} className="space-y-2">
        <label className="fieldset">
          <span className="label">{t('GeneralConfig.titleLabel')}</span>
          <div className="flex space-x-2">
            <TextInput
              placeholder={t('GeneralConfig.titleLabel')}
              onChange={(newValue) => setInput(newValue)}
              value={input}
            />
          </div>
        </label>
        <button type="submit" className="btn btn-neutral">
          {t('save')}
        </button>
      </form>
    </div>
  );
};

export default GeneralConfig;
