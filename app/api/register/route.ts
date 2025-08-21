import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { createUserSchema } from "@/lib/user-schema";
import { ZodError } from "zod";
import crypto from "crypto";

function hash(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = createUserSchema.parse(await req.json());

    const hashed_password = await hash(password);
    

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed_password,
      },
    });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: "error",
          message: "กรอกไม่ถูกต้องตามแบบฟอร์ม",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          status: "fail",
          message: "อีเมลนี้มีผู้ใช้อยู่แล้ว",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
