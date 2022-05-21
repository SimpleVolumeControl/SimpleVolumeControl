import type { NextPage } from 'next';
import Header from '../components/header';
import ConfigEditor from '../components/config';

const Config: NextPage = () => {
  return (
    <>
      <Header isHome={false} />
      <ConfigEditor />
    </>
  );
};

export default Config;
