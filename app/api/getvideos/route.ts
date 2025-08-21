import prisma from "@/prisma/prisma";
import { format } from "date-fns";


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


        const videos = await prisma.video.findMany({
            where: {
                type: { in: [1, 2, 3] }
            },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            orderBy: {
              createdAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                thumbnail: true,
                createdAt: true,
                view_count: true,
                slug:true,
                type:true,
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
            where: {
                type: { in: [1, 2, 3] }
            }});        
          const hasMore = pageNumber * pageSize < totalPosts;
        
          const formattedPosts = videos.map((video) => ({
            ...video,
            viewCountFormatted: video.view_count !== null ? formatViewCount(video.view_count) : "0",
            createdAtAgo: timeAgo(video.createdAt),
          }));

          return new Response(
            JSON.stringify({ message: "Video successful", video: formattedPosts, hasMore }),
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