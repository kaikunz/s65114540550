import WatchVideos from './watchvideo';
import { auth } from '@/auth';
import axios from "axios";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = await auth();
  const user = session?.user;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getvideo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, userIds: user?.id }),
      cache: "no-store",
    });

    if (!res.ok) {
      return { title: "Video not found" };
    }

    const video = await res.json();
    return {
      title: video.title,
      description: video.description || "",
    };
  } catch (error) {
    console.error("Metadata Error:", error);
    return { title: "Video not found" };
  }
}


export default async function VideoPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = await auth();
  const user = session?.user;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getvideo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, userIds: user?.id, method: 1 }),
      cache: "no-store", 
    });

    if (!res.ok) {
      return <div>Video not found</div>;
    }

    const video = await res.json();
    video.slug = slug;
    return <WatchVideos user={user} video={video} />;
  } catch (error) {
    console.error("VideoPage Error:", error);
    return <div>Video not found</div>;
  }
}
