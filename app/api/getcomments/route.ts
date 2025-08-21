import prisma from "@/prisma/prisma";
import { format } from "date-fns";
import { auth } from "@/auth";

export async function POST(req: Request) {

    const { page, Id, method } = await req.json();
    const pageSize = 15; 
    const pageNumber = parseInt(page, 10);

    if (!pageNumber || pageNumber < 1) {
        return new Response(
            JSON.stringify({ error: "Invalid Page" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }    

    if (!page || !Id) {
        return new Response(
            JSON.stringify({ error: "จำเป็นค่ะ" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {

        const session = await auth();
        const user = session?.user;
        let userId;
        if (!user) {
          userId = "unknown";
        } else {
          userId = user.id;
        }

        let posts;

        if (method == 1) {
            posts = await prisma.comment.findMany({
                where: { postId: Id, type: 2},
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
                orderBy: {
                createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                        id: true, 
                        name: true, 
                        image: true, 
                        },
                    },              
                    love_log: {
                    where: { userId }, 
                    select: { id: true },
                    },
                
                },
            });

          const totalPosts = await prisma.comment.count();
          const hasMore = pageNumber * pageSize < totalPosts;
        
          const formattedPosts = posts.map((post) => ({
            ...post,
            createdAt: format(new Date(post.createdAt), "dd/MM/yyyy HH:mm:ss"),
          }));

          return new Response(
            JSON.stringify({ message: "Comment successful", comment: formattedPosts, hasMore }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );

        } else if (method == 2) {

            posts = await prisma.comment.findMany({
                where: { videoId: Id, type: 1},
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
                orderBy: {
                createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                        id: true, 
                        name: true, 
                        image: true, 
                        },
                    },              
                    love_log: {
                    where: { userId }, 
                    select: { id: true },
                    },
                
                },
            });

            const totalPosts = await prisma.comment.count();
            const hasMore = pageNumber * pageSize < totalPosts;
            
            const formattedPosts = posts.map((post) => ({
                ...post,
                createdAt: format(new Date(post.createdAt), "dd/MM/yyyy HH:mm:ss"),
            }));

            return new Response(
                JSON.stringify({ message: "Comment successful", comment: formattedPosts, hasMore }),
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