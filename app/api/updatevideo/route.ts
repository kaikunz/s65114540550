import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";
import fs from 'fs';



export async function POST(req: Request) {

    const session = await auth();
    const user = session?.user;

    const formData = await req.formData();
    const thumbnail = formData.get("thumbnail") as File | null;
    const title = formData.get("title");
    const description = formData.get("description");
    const type = formData.get("type");
    const price_rent = formData.get("price_rent") || null;
    const price_sell = formData.get("price_sell") || null;
    const slugs = formData.get("slug");
    const types = parseInt(type as string, 10);


    
    if (!title || !slugs) {
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

        const filename = `${Date.now()}-thumbnail.png`;
        const filePath = path.join(process.cwd(), "public/uploads", filename);
        
        
        try {
            if (thumbnail) {

                const buffer = Buffer.from(await thumbnail.arrayBuffer());
                fs.writeFileSync(filePath, buffer);

            }
            
            const updatevideo = await prisma.video.update({
                where: {
                  slug: slugs as string,
                },
                data: {
                  title: title as string,
                  description: description as string,
                  type: types,
                  thumbnail: `/uploads/${filename}`,
                  price_rent: price_rent ? parseFloat(price_rent as string) : null,
                  price_sell: price_sell ? parseFloat(price_sell as string) : null,
                },
              })
          
          
              return NextResponse.json(
                { status: "success", message: "Video updated successfully", updatevideo },
                { status: 200 }
              );
          
            
          } catch (error) {
            console.error("Error uploading thumbnail:", error);
            return NextResponse.json(
              { status: "error", message: "Failed to upload thumbnail" },
              { status: 500 }
            );
          }
        

    
}
    