import type { NextPage } from 'next';
import Header from '../../components/header';
import LoginForm from '../../components/loginForm';

const Login: NextPage = () => {
  return (
    <>
      <Header isHome={true} />
      <LoginForm />
    </>
  );
};

export default Login;
