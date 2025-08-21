import prisma from "@/prisma/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

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

    const { followuserId } = await req.json();

    if (!followuserId) {
      return new Response(
        JSON.stringify({ error: "ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existingFollow = await prisma.followers.findFirst({
        where: { userId:user.id, followerUserId: followuserId },
      });
  
      if (existingFollow) {
        await prisma.followers.delete({
          where: { id: existingFollow.id },
        });
  
        return NextResponse.json({ message: "Unfollowed", followed: false });
      } else {

        await prisma.followers.create({
          data: { userId:user.id, followerUserId: followuserId },
        });
  
        return NextResponse.json({ message: "Followed", followed: true });
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
