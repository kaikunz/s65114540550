import { auth } from '@/auth';
import Communitys from './community';

export default async function CommunityPage() {
  const session = await auth(); 
  const user = session?.user;

  return <Communitys user={user} />;
}