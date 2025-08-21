import { auth } from '@/auth';
import Main from './main';

export default async function DashboardProfit() {
  const session = await auth(); 
  const user = session?.user;

  return <Main user={user} />;
}