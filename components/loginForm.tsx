'use client';

import { FC, FormEvent, useState } from 'react';
import useLogin from '../hooks/useLogin';
import TextInput from './textInput';
import { useTranslations } from 'next-intl';

/**
 * This component shows a form which can be used to enter a password.
 */
const LoginForm: FC = () => {
  const t = useTranslations('Login');
  const { login } = useLogin();
  const [input, setInput] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    login(input);
  };
  return (
    <>
      <div className="flex justify-center mt-8 lg:mt-16">
        <div className="card shadow-2xl lg:card-side bg-base-100 max-w-sm text-base-content">
          <div className="card-body">
            <form onSubmit={submit} className="space-y-2">
              <label className="fieldset">
                <span className="label">{t('passwordLabel')}</span>
                <TextInput
                  type="password"
                  placeholder={t('passwordLabel')}
                  className="w-full input input-primary input-bordered"
                  onChange={(newValue) => setInput(newValue)}
                  value={input}
                />
              </label>
              <button type="submit" className="btn btn-primary btn-block">
                {t('loginButton')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
