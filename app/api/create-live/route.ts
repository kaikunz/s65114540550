import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";
import fs from 'fs';
import crypto from "crypto";

 function generateRandomString(length: number = 7): string {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let randomString = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomString += characters[randomIndex];
  }

  return randomString;
}

export async function POST(req: Request) {

    const session = await auth();
    const user = session?.user;

    const formData = await req.formData();
    const thumbnail = formData.get("thumbnail") as File | null;
    const title = formData.get("title");
    const description = formData.get("description");
    const slugs = generateRandomString(10);


    
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
        const paths = generateRandomString(11);

        let str = `${Date.now()}~${paths}`;
        const SEC_LOCK = "#$wel".padEnd(16, " ");
        const cipher = crypto.createCipheriv("aes-128-ecb", Buffer.from(SEC_LOCK, "utf8"), null);
        let encrypted = cipher.update(str, "utf8", "base64");
        encrypted += cipher.final("base64");
        
        
        try {
            if (thumbnail) {

                const buffer = Buffer.from(await thumbnail.arrayBuffer());
                fs.writeFileSync(filePath, buffer);

            }
            
            const updatevideo = await prisma.video.create({
                data: {
                  title: title as string,
                  description: description as string,
                  type: 4,
                  Love_count: 0,
                  OwnerUserID: user.id,
                  slug: slugs,
                  path: encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
                  thumbnail: `/uploads/${filename}`,
                },
              })
          
          
              return NextResponse.json(
                { status: "success", message: "Live create successfully", Live:updatevideo },
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
    