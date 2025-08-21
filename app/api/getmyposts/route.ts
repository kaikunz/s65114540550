import prisma from "@/prisma/prisma";
import { format } from "date-fns";
import { auth } from "@/auth";

export async function POST(req: Request) {

    const { page } = await req.json();
    const pageSize = 15; 
    const pageNumber = parseInt(page, 10);
    const session = await auth();
    const user = session?.user;

    if (!pageNumber || pageNumber < 1) {
        return new Response(
            JSON.stringify({ error: "Invalid Page" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }    

    if (!page || !user) {
        return new Response(
            JSON.stringify({ error: "จำเป็นค่ะ" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {

        

        const Post = await prisma.post.findMany({
            where: {userId: user.id},
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            orderBy: {
              createdAt: 'desc',
            },
          });
      
          const totalVideo = await prisma.post.count();
          const hasMore = pageNumber * pageSize < totalVideo;
        
          const formattedpost = Post.map((post) => ({
            ...post,
            createdAt: format(new Date(post.createdAt), "dd/MM/yyyy HH:mm:ss"),
          }));

          return new Response(
            JSON.stringify({ message: "post successful", posts: formattedpost, hasMore }),
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