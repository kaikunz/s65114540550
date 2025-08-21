import { auth } from '@/auth';
import Sidebar from './sidebar';

export default async function SidebarWrapper() {
  const session = await auth(); 
  const user = session?.user;

  return <Sidebar user={user} />;
}