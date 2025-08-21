import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";
import fs from 'fs';



export async function POST(req: Request) {

    const session = await auth();
    const user = session?.user;

    const {path} = await req.json();
    const types = 1;

    
    if (!path) {
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


        try {
          
            
            const updatevideo = await prisma.video.update({
                where: {
                  path: path as string,
                },
                data: {
                  type: types,
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
    