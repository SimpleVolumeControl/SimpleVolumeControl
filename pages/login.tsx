import type { NextPage } from 'next';
import Header from '../components/header';
import LoginForm from '../containers/loginForm';

const Login: NextPage = () => {
  return (
    <>
      <Header isHome={true} hideLogout={true} />
      <LoginForm />
    </>
  );
};

export default Login;
