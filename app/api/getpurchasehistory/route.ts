import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const { pageBuy = 1, pageRent = 1, pageSize = 5 } = await req.json();

    const session = await auth();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Login Required" }, { status: 400 });
    }

    const purchasesBuy = await prisma.purchase.findMany({
        where: { userId:user.id, type: 1 },
        skip: (pageBuy - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          video: {
            select: { id: true, title: true, thumbnail: true, price_sell: true, slug:true },
          },
        },
      });
  
      const purchasesRent = await prisma.purchase.findMany({
        where: { userId:user.id, type: 2 },
        skip: (pageRent - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          video: {
            select: { id: true, title: true, thumbnail: true, price_rent: true, slug:true },
          },
        },
      });
  
      const totalBuy = await prisma.purchase.count({ where: { userId:user.id, type: 1 } });
      const totalRent = await prisma.purchase.count({ where: { userId:user.id, type: 2 } });
  
      return NextResponse.json({
        purchasesBuy,
        purchasesRent,
        hasMoreBuy: pageBuy * pageSize < totalBuy,
        hasMoreRent: pageRent * pageSize < totalRent,
      });
  
  } catch (error) {
    console.error("Error in getPurchases API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
