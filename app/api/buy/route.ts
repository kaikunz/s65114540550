import prisma from "@/prisma/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {

  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
        return new Response(
          JSON.stringify({ error: "User ID is undefined" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const { videoId } = await req.json();

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: "Video ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return new Response(
        JSON.stringify({ error: "Video not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        videoId,
      },
    });

    if (existingPurchase) {
      return new Response(
        JSON.stringify({ message: "You already own this video" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const purchase = await prisma.purchase.create({
        data: {
          userId: user.id,          
          videoId,                  
          type: 1,                 
          expire_date: null,      
        },
      });

    return new Response(
      JSON.stringify({ message: "Purchase successful", purchase }),
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
