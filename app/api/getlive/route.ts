import prisma from "@/prisma/prisma";
import { format } from "date-fns";
import { auth } from "@/auth";

export async function POST(req: Request) {

    const { page } = await req.json();
    const pageSize = 15; 
    const pageNumber = parseInt(page, 10);

    if (!pageNumber || pageNumber < 1) {
        return new Response(
            JSON.stringify({ error: "Invalid Page" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }    

    if (!page) {
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

        const videos = await prisma.video.findMany({
            where: {
                type: 5
            },
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
            
            },
          });
      
          const totalPosts = await prisma.video.count({
            where: {type: 5 }});        
          const hasMore = pageNumber * pageSize < totalPosts;
        
          const formattedPosts = videos.map((video) => ({
            ...video,
            createdAt: format(new Date(video.createdAt), "dd/MM/yyyy HH:mm:ss"),
          }));

          return new Response(
            JSON.stringify({ message: "Live successful", video: formattedPosts, hasMore }),
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