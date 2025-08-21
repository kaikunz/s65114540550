import prisma from "@/prisma/prisma";
import { auth } from "@/auth";

function timeAgo(datetime: string | Date): string {
  const date = typeof datetime === 'string' ? new Date(datetime) : datetime; // ตรวจสอบชนิดข้อมูล
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} วินาทีที่แล้ว`;
  } else if (minutes < 60) {
    return `${minutes} นาทีที่แล้ว`;
  } else if (hours < 24) {
    return `${hours} ชั่วโมงที่แล้ว`;
  } else if (days < 30) {
    return `${days} วันที่แล้ว`;
  } else if (days < 365) {
    return `${Math.floor(days / 30)} เดือนที่แล้ว`;
  } else {
    return `${Math.floor(days / 365)} ปีที่แล้ว`;
  }
}


function formatViewCount(count: number): string {
  if (count >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  } else if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`; 
  } else if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K`; 
  } else {
    return count.toString(); 
  }
}


export async function GET(req: Request) {

const session = await auth();
  const user = session?.user;
  let userId;

  if (!user) {
    userId = "unknown";
  } else {
    userId = user.id;
  }

  try {
    const videos = await prisma.video.findMany({
      where: {
          type: { in: [1, 2, 3] }
      },
      select: {
          title: true,
          thumbnail: true,
          type: true,
          price_rent: true,
          price_sell: true,
          slug: true,
          view_count: true,
          createdAt: true,
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
  

    const result = videos.map((video) => ({
      ...video,
      viewCountFormatted: video.view_count !== null ? formatViewCount(video.view_count) : "0",
      createdAtAgo: timeAgo(video.createdAt),
    }));
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}