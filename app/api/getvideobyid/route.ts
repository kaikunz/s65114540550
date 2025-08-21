import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from '@/auth';

export async function POST(req: NextRequest) {

    const session = await auth();
    const user = session?.user;

    if (!user) {
        return NextResponse.json({ error: "Login Required" }, { status: 400 });
    }

    try {
      const { videoId } = await req.json(); 
  
      if (!videoId) {
        return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
      }
  
      const video = await prisma.video.findUnique({
        where: { id: videoId },
        select: {
            id:true,
            title:true,
            description:true,
            thumbnail:true,
            type:true,
            price_rent:true,
            price_sell:true
        }
      });
  
      if (!video) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }
  
      return NextResponse.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  