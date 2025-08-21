import prisma from "@/prisma/prisma";
import { auth } from "@/auth";

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

    const { id, method } = await req.json();

    if (!id || !method) {
      return new Response(
        JSON.stringify({ error: "PostID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (method == 1) {

    const existingLoveLog = await prisma.love_log.findFirst({
      where: {
        userId: user.id, 
        postId: id, 
      },
    });

    if (!existingLoveLog) {
      const post = await prisma.post.update({
        where: { id: id },
        data: {
          Love_count: {
            increment: 1,
          },
        },
      });
    
      await prisma.love_log.create({
        data: {
          userId: user.id,
          postId: id,
          type: 2,
        },
      });
      
      const formattedPosts = {
          ...post,
          liked: 1, 
      };

      return new Response(
        JSON.stringify({ message: "Love added", type:1, post:formattedPosts }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const post = await prisma.post.update({
        where: { id: id },
        data: {
          Love_count: {
            decrement: 1,
          },
        },
      });
    
      await prisma.love_log.delete({
        where: {
          id: existingLoveLog.id,
        },
      });
      
      const formattedPosts = {
        ...post,
        liked: 2, 
      };

      return new Response(
        JSON.stringify({ message: "Love removed", type:2, post:formattedPosts }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    } else if (method == 2) {
      const existingLoveLog = await prisma.love_log.findFirst({
        where: {
          userId: user.id, 
          commentId: id, 
        },
      });
  
      if (!existingLoveLog) {
        const post = await prisma.comment.update({
          where: { id: id },
          data: {
            Love_count: {
              increment: 1,
            },
          },
        });
      
        await prisma.love_log.create({
          data: {
            userId: user.id,
            commentId: id,
            type: 2,
          },
        });
        
        const formattedPosts = {
            ...post,
            liked: 1, 
        };
  
        return new Response(
          JSON.stringify({ message: "Love added", type:1, post:formattedPosts }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        const post = await prisma.comment.update({
          where: { id: id },
          data: {
            Love_count: {
              decrement: 1,
            },
          },
        });
      
        await prisma.love_log.delete({
          where: {
            id: existingLoveLog.id,
          },
        });
        
        const formattedPosts = {
          ...post,
          liked: 2, 
        };
  
        return new Response(
          JSON.stringify({ message: "Love removed", type:2, post:formattedPosts }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

    } else if (method == 3) {
      const existingLoveLog = await prisma.love_log.findFirst({
        where: {
          userId: user.id, 
          commentId: id, 
        },
      });
  
      if (!existingLoveLog) {
        const post = await prisma.comment.update({
          where: { id: id },
          data: {
            Love_count: {
              increment: 1,
            },
          },
        });
      
        await prisma.love_log.create({
          data: {
            userId: user.id,
            commentId: id,
            type: 2,
          },
        });
        
        const formattedPosts = {
            ...post,
            liked: 1, 
        };
  
        return new Response(
          JSON.stringify({ message: "Love added", type:1, post:formattedPosts }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        const post = await prisma.comment.update({
          where: { id: id },
          data: {
            Love_count: {
              decrement: 1,
            },
          },
        });
      
        await prisma.love_log.delete({
          where: {
            id: existingLoveLog.id,
          },
        });
        
        const formattedPosts = {
          ...post,
          liked: 2, 
        };
  
        return new Response(
          JSON.stringify({ message: "Love removed", type:2, post:formattedPosts }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    } else if (method == 4) {
      const existingLoveLog = await prisma.love_log.findFirst({
        where: {
          userId: user.id, 
          videoId: id, 
        },
      });
  
      if (!existingLoveLog) {
        const post = await prisma.video.update({
          where: { id: id },
          data: {
            Love_count: {
              increment: 1,
            },
          },
        });
      
        await prisma.love_log.create({
          data: {
            userId: user.id,
            videoId: id,
            type: 2,
          },
        });
        
        const formattedPosts = {
            ...post,
            liked: 1, 
        };
  
        return new Response(
          JSON.stringify({ message: "Love added", type:1, post:formattedPosts }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        const post = await prisma.video.update({
          where: { id: id },
          data: {
            Love_count: {
              decrement: 1,
            },
          },
        });
      
        await prisma.love_log.delete({
          where: {
            id: existingLoveLog.id,
          },
        });
        
        const formattedPosts = {
          ...post,
          liked: 2, 
        };
  
        return new Response(
          JSON.stringify({ message: "Love removed", type:2, post:formattedPosts }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    }
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
