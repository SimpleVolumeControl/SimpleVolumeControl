import type { NextPage } from 'next';
import Header from '../../components/header';
import MixDetails from '../../containers/mixDetails';
import { useRouter } from 'next/router';

const Mix: NextPage = () => {
  const router = useRouter();
  const { mix } = router.query;
  return (
    <>
      <Header isHome={false} />
      {typeof mix === 'string' && <MixDetails mixId={mix} />}
    </>
  );
};

export default Mix;
