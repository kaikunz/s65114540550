import PostDetail from './post';
import { auth } from '@/auth';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = params;
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getpost`, {
      next: { revalidate: 0 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: slug,
      }),
    });
  
    if (!res.ok) {
      return {
        title: 'Post Not Found',
        description: 'The post you are looking for does not exist.',
      };
    }
  
    const post = await res.json();
    const posts = post.posts;
    return {
        title: posts.content
          ? posts.content.length > 100
            ? posts.content.slice(0, 100) + "..." 
            : posts.content 
          : "No Content", 
      };
      
  }


export default async function posts({ params }: { params: { slug: string } }) {

    const { slug } = params;
    const session = await auth();
    const user = session?.user;
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getpost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "userId": user?.id || "" , 
        },
        body: JSON.stringify({ postId: slug }),
        next: { revalidate: 0 },
      });
    
      if (!res.ok) {
        return <div>Post not found</div>;
      }
    
      const post = await res.json();
      const postWithSlug = { ...post, slugs: slug };

      


      return <PostDetail user={user} post={postWithSlug.posts} />;

}