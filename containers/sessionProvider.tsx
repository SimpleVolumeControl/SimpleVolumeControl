import { FC, useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';

interface SessionProviderProps {}

export const passwordState = atom<string | null>({
  key: 'passwordState',
  default: null,
});

const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const [password, setPassword] = useRecoilState(passwordState);
  useEffect(() => {
    setPassword(window.localStorage.getItem('password') ?? ''); // TODO Replace with hash('')
  }, [setPassword]);
  useEffect(() => {
    if (password !== null) {
      window.localStorage.setItem('password', password);
    }
  }, [password]);

  return <>{children}</>;
};

export default SessionProvider;
