import type { NextPage } from 'next';
import Header from '../components/header';
import MixOverview from '../components/mixOverview';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <>
      <Header isHome={true} />
      <MixOverview />
      <div className="container mx-auto text-right mt-4">
        <Link href="/config" className="link link-hover">
          Einstellungen
        </Link>
      </div>
    </>
  );
};

export default Home;
