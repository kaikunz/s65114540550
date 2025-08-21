import { auth } from '@/auth';
import VideoMain from './main';

export default async function VideoMainPage() {
  const session = await auth(); 
  const user = session?.user;

  return <VideoMain user={user} />;
}