import type { NextPage } from 'next';
import MixDetails from '../../../components/mixDetails';

const Mix: NextPage<{
  params: { mix?: string };
}> = ({ params }) => {
  const { mix } = params;
  return typeof mix === 'string' ? <MixDetails mixId={mix} /> : null;
};

export default Mix;
