import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import crypto from "crypto";

dotenv.config();

const prisma = new PrismaClient();

async function create_account() {
  try {

    console.log(`Account Creating...`);

    function hash(password) {
      return crypto.createHash("sha256").update(password).digest("hex");
    }

    let user = await prisma.user.findUnique({
        where: { email: "test@admin.com" },
    });

    if (!user) {
        
        const password = "1234"
        const hashed_password = await hash(password);

        user = await prisma.user.create({
            data: {
              name: "admin", 
              email: "test@admin.com",
              nickname: "admin",
              follower: 0, 
              password: hashed_password,
            },
        });
        
    }
    
    console.log("Account created! test@admin.com");

    
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

create_account();