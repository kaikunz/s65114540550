import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { auth, signOut } from "@/auth";
import path from "path";
import fs from 'fs';


  

export async function POST(req: Request) {

    
    const session = await auth();
    const user = session?.user;

    
      

    const formData = await req.formData();
    const thumbnail = formData.get("thumbnail") as File | null;
    const name = formData.get("name");

    if (!name) {
        return NextResponse.json(
            {
              status: "error",
              message: "Missing Param"
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

        const updateUser = await prisma.user.update({
            where: {
              id: user?.id as string,
            },
            data: {
              name: name as string,
              image: `/uploads/${filename}`,
            },
          })

          return NextResponse.json(
            { status: "success", message: "User updated successfully", updateUser },
            { status: 200 }
          );

          
          
    } catch (error) {
        console.error("Error uploading thumbnail:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to upload thumbnail" },
            { status: 500 }
        );
          
    } finally {
        await prisma.$disconnect();
    }

}