import { FC, FormEvent, useState } from 'react';
import useLogin from '../hooks/useLogin';

interface LoginFormProps {}

/**
 * This component shows a form which can be used to enter a password.
 */
const LoginForm: FC<LoginFormProps> = () => {
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
