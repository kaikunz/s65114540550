import prisma from "@/prisma/prisma";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";


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

    const { query, page = 1 } = await req.json();

    const pageSize = 10; 

    if (!page) {
        return new Response(
            JSON.stringify({ error: "เพจจำเป็นค่ะ" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (!query || query.trim() === "") {
        return new Response(
            JSON.stringify({ error: "Query Required" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

    try {

        const videos = await prisma.video.findMany({
            where: {
              title: { contains: query, mode: "insensitive" },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: "desc" },
            select: {
                id:true,
                title:true,
                thumbnail:true,
                createdAt:true,
                slug:true,
                user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
            }
          });
      
          const totalCount = await prisma.video.count({
            where: { title: { contains: query, mode: "insensitive" } },
          });
      
          return NextResponse.json({
            videos,
            hasMore: page * pageSize < totalCount,
          });
      

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