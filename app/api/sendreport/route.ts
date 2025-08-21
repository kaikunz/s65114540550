import prisma from "@/prisma/prisma";
import { auth } from "@/auth";
import { format } from "date-fns";

export async function POST(req: Request) {

  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
        return new Response(
          JSON.stringify({ error: "จำเป็นต้องล็อกอินก่อน" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const { id, reason } = await req.json();

    if (!reason || !id) {
      return new Response(
        JSON.stringify({ error: "Reason is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const check = await prisma.report.findFirst({
        where: {userId: user.id, videoId: id}
    })

    if (check) {
        return new Response(
            JSON.stringify({ error: "คุณรายงานไปแล้วนะคะ"}),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
    }

    const report = await prisma.report.create({
        data: {
          userId: user.id,          
          videoId: id,                  
          type: 1,
          reason: reason
        },
      });
    
      const formattedreport = {
        ...report,
        createdAt: format(new Date(report.createdAt), "dd/MM/yyyy HH:mm:ss"),
        updatedAt: format(new Date(report.updatedAt), "dd/MM/yyyy HH:mm:ss"),
      };

    return new Response(
      JSON.stringify({ message: "Report successful", report: formattedreport }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
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
