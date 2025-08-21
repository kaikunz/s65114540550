import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {

    const session = await auth();
    const user = session?.user;

    try {
        const { title, description, thumbnail, type, price_rent, price_sell, slug, path} = await req.json();
    
        if (!title || !slug) {
            return NextResponse.json(
                {
                  status: "error",
                  message: "Missing Param"
                },
                { status: 400 }
              );
        }
        
        if (!user || !user.id) {
            return NextResponse.json(
                {
                  status: "error",
                  message: "User not found"
                },
                { status: 400 }
              );
        }

        const video = await prisma.video.create({
          data: {
            title,
            description,
            thumbnail,
            type,
            price_rent,
            price_sell,
            slug,
            path,
            OwnerUserID: user.id,
            Love_count: 0,
          },
        });
    
        return NextResponse.json(
            {
              status: "success",
              message: "Added video into database"
            },
            { status: 201 }
          );
      } catch (error) {
        console.error("Error adding video:", error);
        return NextResponse.json(
            {
              status: "error",
              message: error
            },
            { status: 400 }
          );
      }
    

}