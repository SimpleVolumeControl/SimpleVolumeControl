import NullableConfig from '../../model/nullableConfig';
import { FC, FormEvent, useState } from 'react';
import { hash } from '../../hooks/useLogin';
import TextInput from '../textInput';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface PasswordConfigProps {
  config: NullableConfig;
  changeConfig: (config: NullableConfig) => void;
}

const PasswordConfig: FC<PasswordConfigProps> = ({ changeConfig }) => {
  const t = useTranslations('ConfigEditor');
  const [input, setInput] = useState('');
  const [repeat, setRepeat] = useState('');
  const router = useRouter();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (input === repeat) {
      changeConfig({ password: hash(input) });
      setInput('');
      setRepeat('');
      router.push('/');
    } else {
      alert(t('PasswordConfig.mismatch'));
      setInput('');
      setRepeat('');
    }
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
          className="text-info shrink-0 w-6 h-6"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
        <div className="block space-y-2 text-justify">
          <p>{t('PasswordConfig.disclaimer1')}</p>
          <p>{t('PasswordConfig.disclaimer2')}</p>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-2">
        <label className="fieldset">
          <span className="label">{t('PasswordConfig.passwordLabel')}</span>
          <TextInput
            type="password"
            placeholder={t('PasswordConfig.passwordLabel')}
            onChange={(newValue) => setInput(newValue)}
            value={input}
          />
        </label>
        <label className="fieldset">
          <span className="label">{t('PasswordConfig.repeatLabel')}</span>
          <TextInput
            type="password"
            placeholder={t('PasswordConfig.repeatLabel')}
            onChange={(newValue) => setRepeat(newValue)}
            value={repeat}
          />
        </label>
        <button type="submit" className="btn btn-neutral">
          {t('save')}
        </button>
      </form>
    </div>
  );
};

export default PasswordConfig;
