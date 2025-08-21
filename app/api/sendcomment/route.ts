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

    const { text, Id, method } = await req.json();

    if (!text || !Id || !method) {
      return new Response(
        JSON.stringify({ error: "Text And PostID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (method == 1) {
        const comment = await prisma.comment.create({
            data: {
            userId: user.id,          
            comment: text,     
            postId: Id,             
            Love_count: 0,
            type: 2
            },
        });
        
        const formattedcomment = {
            ...comment,
            createdAt: format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm:ss"),
            updatedAt: format(new Date(comment.updatedAt), "dd/MM/yyyy HH:mm:ss"),
        };

        return new Response(
        JSON.stringify({ message: "Posts successful", posts: formattedcomment }),
        { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } else if (method == 2) {

        const comment = await prisma.comment.create({
            data: {
            userId: user.id,          
            comment: text,     
            videoId: Id,             
            Love_count: 0,
            type: 1
            },
        });
        
        const formattedcomment = {
            ...comment,
            createdAt: format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm:ss"),
            updatedAt: format(new Date(comment.updatedAt), "dd/MM/yyyy HH:mm:ss"),
        };

        return new Response(
        JSON.stringify({ message: "Posts successful", posts: formattedcomment }),
        { status: 200, headers: { "Content-Type": "application/json" } }
        );

    }
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
