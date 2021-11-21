import type { NextPage } from 'next';
import Header from '../components/header';
import MixOverview from '../containers/mixOverview';

const Home: NextPage = () => {
  return (
    <>
      <Header isHome={true} />
      <MixOverview />
    </>
  );
};

export default Home;
