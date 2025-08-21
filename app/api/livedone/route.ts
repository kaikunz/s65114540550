import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    let body = "";

    try {
        const reader = req.body?.getReader();
        if (reader) {
            const { value } = await reader.read();
            body = new TextDecoder().decode(value);
        }


        const params = new URLSearchParams(body);
        const data = Object.fromEntries(params.entries());

        

        const name = data.name || "unknown";

        if (!name) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Missing Param"
                },
                { status: 400 }
            );
        }

        const updatevideo = await prisma.video.update({
            where: {
                path: name as string,
            },
            data: {
                type: 6
            },
        });

        return NextResponse.json(
            { status: "success", message: "Live updated successfully", updatevideo },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error processing request:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to process request" },
            { status: 500 }
        );
    }
}

