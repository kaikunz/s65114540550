import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {
  
    const { userId, user } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let users;

    if (user) {
        users = user;
    }

    const usercheck = await prisma.user.findFirst({
        where: { id:userId}, select: {
            name: true,
            image: true,
            id:true,
            _count: {
                select: { followers: true }, 
            },
          
        }
      });

      const followCheck = await prisma.followers.findFirst({
        where: { userId: users, followerUserId: userId },
      });
      
      const hasFollow = !!followCheck;
      if (usercheck) {
       return new Response(
            JSON.stringify({ user: usercheck, hasFollow, followcount: usercheck._count.followers }),
            {
              status: 200,
              headers: { "Content-Type": "application/json"},
              
            }
          );
      } else {

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
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
