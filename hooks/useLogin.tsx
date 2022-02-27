import { atom, useRecoilState } from 'recoil';
import sjcl from 'sjcl';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const hash = (value: string): string =>
  sjcl.codec.base64.fromBits(sjcl.hash.sha256.hash(value));

const emptyPassword = hash('');

const passwordState = atom<string>({
  key: 'passwordState',
  default: emptyPassword,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => window?.localStorage?.setItem('password', newValue));
    },
  ],
});

function useLogin() {
  const [password, setPassword] = useRecoilState(passwordState);
  const router = useRouter();
  useEffect(() => {
    const passwordHash = window.localStorage.getItem('password');
    if (passwordHash !== null) {
      setPassword(passwordHash);
    }
  });
  const login = (password: string) => {
    setPassword(hash(password));
    router.push('/').then();
  };
  const logout = () => {
    setPassword(emptyPassword);
    router.push('/login').then();
  };
  const isLoggedIn = password !== emptyPassword;
  return { login, logout, isLoggedIn, password };
}

export default useLogin;
