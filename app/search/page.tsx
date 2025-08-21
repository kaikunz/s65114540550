import { auth } from '@/auth';
import SearchVideo from './main';

export default async function SearchMain() {
  const session = await auth(); 
  const user = session?.user;

  return <SearchVideo user={user} />;
}