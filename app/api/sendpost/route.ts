import prisma from "@/prisma/prisma";
import { auth } from "@/auth";
import { format } from "date-fns";

export async function POST(req: Request) {

  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
        return new Response(
          JSON.stringify({ error: "จำเป็นต้องล็อกอินก่อน" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const posts = await prisma.post.create({
        data: {
          userId: user.id,          
          content: text,                  
          Love_count: 0    
        },
      });
    
      const formattedPosts = {
        ...posts,
        createdAt: format(new Date(posts.createdAt), "dd/MM/yyyy HH:mm:ss"),
        updatedAt: format(new Date(posts.updatedAt), "dd/MM/yyyy HH:mm:ss"),
      };

    return new Response(
      JSON.stringify({ message: "Posts successful", posts: formattedPosts }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing purchase:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await prisma.$disconnect();
  }
}
