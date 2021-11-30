import { FC, FormEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { passwordState } from './sessionProvider';
import { useRouter } from 'next/router';

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = () => {
  const setPassword = useSetRecoilState(passwordState);
  const [input, setInput] = useState('');
  const router = useRouter();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setPassword(input);
    router.push('/').then();
  };
  return (
    <>
      <div className="flex justify-center mt-8 lg:mt-16">
        <div className="card shadow-2xl lg:card-side bg-base-100 max-w-sm text-base-content">
          <div className="card-body">
            <form onSubmit={submit} className="space-y-2">
              <div className="form-control">
                <label>
                  <div className="label">
                    <span className="label-text">Passwort</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Passwort"
                    className="w-full input input-primary input-bordered"
                    onChange={(event) => setInput(event.target.value)}
                  />
                </label>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
