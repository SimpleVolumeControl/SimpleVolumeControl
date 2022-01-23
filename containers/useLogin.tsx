import { useRecoilState } from 'recoil';
import { passwordState } from './sessionProvider';
import sjcl from 'sjcl';
import { useRouter } from 'next/router';

const hash = (value: string): string =>
  sjcl.codec.base64.fromBits(sjcl.hash.sha256.hash(value));

const emptyPassword = hash('');

function useLogin() {
  const [password, setPassword] = useRecoilState(passwordState);
  const router = useRouter();
  const login = (password: string) => {
    setPassword(hash(password));
    router.push('/').then();
  };
  const logout = () => {
    setPassword(emptyPassword);
    router.push('/login').then();
  };
  const isLoggedIn = password !== emptyPassword;
  return { login, logout, isLoggedIn };
}

export default useLogin;
