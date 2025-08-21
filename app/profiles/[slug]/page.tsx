import ProfileUser from './profileuser';
import axios from "axios";
import { auth } from '@/auth';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getuserprofile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: slug }),
      cache: "no-store",
    });

    if (!res.ok) {
      return { title: "Profile Not Found" };
    }

    const profile = await res.json();

    return {
      title: profile.user?.name || "Profile",
      description: profile.user?.name || "",
    };
  } catch (error) {
    console.error("Metadata Error:", error);
    return { title: "Profile Not Found" };
  }
}


export default async function ProfilePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = await auth();
  const user = session?.user;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getuserprofile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: slug, user: user?.id }),
      cache: "no-store",
    });

    if (!res.ok) {
      return <div>Profile not found</div>;
    }

    const profile = await res.json();

    return <ProfileUser user={user} profile={profile} />;

  } catch (error) {
    console.error("ProfilePage Error:", error);
    return <div>Profile not found</div>;
  }


  
}