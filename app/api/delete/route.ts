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

        //delete video

        const videodelete = await prisma.video.delete({
            where: {id: id, OwnerUserID: user.id}
        })

        return new Response(
            JSON.stringify({ message: "Delete successful", video: videodelete}),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );

    } else if (method == 2) {

        //delete post
        const postdelete = await prisma.post.delete({
          where: {id: id, userId: user.id}
      })

      return new Response(
          JSON.stringify({ message: "Delete successful", post: postdelete}),
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
