import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from '@/auth';
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {

    const session = await auth();
    const user = session?.user;

    if (!user) {
        return NextResponse.json({ error: "Login Required" }, { status: 400 });
    }

  try {
    const formData = await req.formData();
    const videoId = formData.get("videoId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = parseInt(formData.get("type") as string);
    const price_rent = formData.get("price_rent") ? parseFloat(formData.get("price_rent") as string) : null;
    const price_sell = formData.get("price_sell") ? parseFloat(formData.get("price_sell") as string) : null;
    const thumbnail = formData.get("thumbnail") as File | null;

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    let thumbnailPath: string | undefined = undefined;

    if (thumbnail) {
      const bytes = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${thumbnail.name}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", fileName);
      await writeFile(uploadPath, buffer);
      thumbnailPath = `/uploads/${fileName}`;
    }

    await prisma.video.update({
      where: { id: videoId, OwnerUserID: user.id },
      data: {
        title,
        description,
        type,
        price_rent,
        price_sell,
        ...(thumbnailPath && { thumbnail: thumbnailPath }), 
      },
    });

    return NextResponse.json({ message: "Video updated successfully" });
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}
