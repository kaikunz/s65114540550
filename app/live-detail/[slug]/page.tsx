import { auth } from '@/auth';
import LiveDetail from './main';

export default async function DetailLive({ params }: { params: { slug: string } }) {
  const session = await auth(); 
  const user = session?.user;
  const { slug } = params;

  return <LiveDetail user={user} slug={slug} />;
}