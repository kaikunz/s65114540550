import { auth } from '@/auth';
import HistoryPage from './main';

export default async function History() {
  const session = await auth(); 
  const user = session?.user;

  return <HistoryPage user={user} />;
}