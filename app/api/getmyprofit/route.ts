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

      const Video = await prisma.video.findMany({
        where: { OwnerUserID: user.id, type:2 },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      });
      
      const totalVideo = await prisma.video.count({ where: { OwnerUserID: user.id } });
      const hasMore = pageNumber * pageSize < totalVideo;
      
      const videosWithPurchases = await Promise.all(
        Video.map(async (video) => {
          const purchaseType1 = await prisma.purchase.count({
            where: { videoId: video.id, type: 1 },
          });
      
          const purchaseType2 = await prisma.purchase.count({
            where: { videoId: video.id, type: 2 },
          });
      
          return { ...video, rent:purchaseType1, buy:purchaseType2 };
        })
      );
      
      return new Response(
        JSON.stringify({ message: "videos successful", videos: videosWithPurchases, hasMore }),
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