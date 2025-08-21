import prisma from "@/prisma/prisma";
import { format } from "date-fns";
import { auth } from "@/auth";

export async function POST(req: Request) {

    const session = await auth();
    const user = session?.user;

  
    if (!user) {
        return new Response(
            JSON.stringify({ error: "จำเป็นค่ะ" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {

        

        const usercount = await prisma.user.count();

          const reportCount = await prisma.report.count();

      

          return new Response(
            JSON.stringify({ message: "successful", usercount: usercount, reportCount: reportCount}),
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