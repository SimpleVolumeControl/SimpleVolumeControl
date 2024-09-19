import type { NextPage } from 'next';
import Header from '../../../components/header';
import MixDetails from '../../../components/mixDetails';

const Mix: NextPage<{
  params: { mix?: string };
}> = ({ params }) => {
  const { mix } = params;
  return (
    <>
      <Header isHome={false} />
      {typeof mix === 'string' && <MixDetails mixId={mix} />}
    </>
  );
};

export default Mix;
