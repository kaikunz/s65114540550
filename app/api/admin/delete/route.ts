import prisma from "@/prisma/prisma";
import { auth } from "@/auth";

export async function DELETE(req: Request) {

  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
        return new Response(
          JSON.stringify({ error: "จำเป็นต้องล็อกอินก่อน" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const { id, method } = await req.json();

    if (!id || !method) {
      return new Response(
        JSON.stringify({ error: "PostID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (method == 1) {

        //delete user

        const userdelete = await prisma.user.delete({
            where: {id: id}
        })

        return new Response(
            JSON.stringify({ message: "Delete successful", user: userdelete}),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );

    } else if (method == 2) {

        //delete video

        const userdelete = await prisma.video.delete({
            where: {id: id}
        })

        return new Response(
            JSON.stringify({ message: "Delete successful", video: userdelete}),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );

    } else if (method == 3) {

        //delete video from report
        try {
            const report = await prisma.report.findUnique({
              where: { id: id },
              select: { videoId: true }, 
            });
        
            if (!report) {
                return new Response(
                    JSON.stringify({ error: "Internal Server Error" }),
                    { status: 500, headers: { "Content-Type": "application/json" } }
                  );
            }
        
            const videoId = report.videoId;

            if (!videoId) {
                return new Response(
                    JSON.stringify({ error: "Internal Server Error" }),
                    { status: 500, headers: { "Content-Type": "application/json" } }
                  );
              }
        
              await prisma.$transaction([
                prisma.report.deleteMany({
                  where: { videoId: videoId }, 
                }),
                prisma.video.delete({
                  where: { id: videoId },
                }),
              ]);
              
        
            return new Response(
                JSON.stringify({ message: "Delete successful", video: videoId}),
                { status: 200, headers: { "Content-Type": "application/json" } }
              );

          } catch (error) {
            return new Response(
                JSON.stringify({ error: "Internal Server Error" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
              );
          }
        


        

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
