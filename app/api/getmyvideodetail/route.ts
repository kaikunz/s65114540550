import prisma from "@/prisma/prisma";
import { format } from "date-fns";
import { auth } from "@/auth";

export async function POST(req: Request) {

    const { id } = await req.json();
    const session = await auth();
    const user = session?.user;

  
    if (!id || !user) {
        return new Response(
            JSON.stringify({ error: "จำเป็นค่ะ" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {

        

        const Video = await prisma.video.findFirst({
            where: {OwnerUserID: user.id, id:id},
          });

          const commentCount = await prisma.comment.count({
            where: {userId: user.id, videoId:id},
          });

          const [purchaseType1, purchaseType2] = await Promise.all([
            prisma.purchase.count({
              where: { videoId: id, type: 1 },
            }),
            prisma.purchase.count({
              where: { videoId: id, type: 2 },
            }),
          ]);
      
        
        //   const formattedVideo = Video.map((Video) => ({
        //     ...Video,
        //     createdAt: format(new Date(Video.createdAt), "dd/MM/yyyy HH:mm:ss"),
        //   }));

          return new Response(
            JSON.stringify({ message: "videos successful", video: Video, comment: commentCount, countpurchase: purchaseType1 + purchaseType2, buy:purchaseType1, rent:purchaseType2}),
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