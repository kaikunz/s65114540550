import prisma from "@/prisma/prisma";
import { format } from "date-fns";

export async function POST(req: Request) {

    const { postId } = await req.json();
    const userIds = req.headers.get("userId");
   

    if (!postId) {
        return new Response(
            JSON.stringify({ error: "จำเป็นค่ะ" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        let userId;
        if (!userIds) {
          userId = "unknown";
        } else {
          userId = userIds;
        }

        const posts = await prisma.post.findFirst({
            where: {
                id: postId
            },
            include: {
                user: {
                    select: {
                      id: true, 
                      name: true, 
                      image: true, 
                    },
                  },              
                video: true, 
                love_log: {
                  where: { userId }, 
                  select: { id: true },
                },
            
            },
          });
      
          if (!posts) {
            return new Response(
                JSON.stringify({ error: "ไม่พบค่ะ" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
          const formattedPosts = {
            ...posts,
            createdAt: format(new Date(posts.createdAt), "dd/MM/yyyy HH:mm:ss"),
          };

          return new Response(
            JSON.stringify({ message: "Posts successful", posts: formattedPosts}),
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