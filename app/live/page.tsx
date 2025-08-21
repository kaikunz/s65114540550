import { auth } from '@/auth';
import Lives from './live';

export default async function LivePage() {
  const session = await auth(); 
  const user = session?.user;

  return <Lives user={user} />;
}