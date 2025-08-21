import { auth } from '@/auth';
import LiveCreate from './main';

export default async function DashboardMain() {
  const session = await auth(); 
  const user = session?.user;

  return <LiveCreate user={user} />;
}