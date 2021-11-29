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
      <form onSubmit={submit}>
        <input onChange={(event) => setInput(event.target.value)} />
      </form>
    </>
  );
};

export default LoginForm;
