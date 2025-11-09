import type { NextPage } from 'next';
import MixDetails from '../../../components/mixDetails';

const Mix: NextPage<{
  params: Promise<{ mix?: string }>;
}> = async ({ params }) => {
  const { mix } = await params;
  return typeof mix === 'string' ? <MixDetails mixId={mix} /> : null;
};

export default Mix;
