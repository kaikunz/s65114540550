require('dotenv').config();
const xlsx = require('xlsx');
const { hash } = require("bcryptjs");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importXlsx() {
  try {
    const filePath = './scripts/data.xlsx';

    console.log(`Importing data from ${filePath}...`);

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log('Data:', sheetData);

    let user = await prisma.user.findUnique({
        where: { email: "admin2@admin.com" },
    });

    if (!user) {
        
        const password = "1234"
        const hashed_password = await hash(password, 12);

        user = await prisma.user.create({
            data: {
              name: "admin2", 
              email: "admin2@admin.com",
              nickname: "admin2",
              follower: 0, 
              password: hashed_password,
            },
        });
        
    }

    for (const row of sheetData) {
        await prisma.video.create({
          data: {
            title: row.title || null,
            description: row.description || null,
            thumbnail: row.thumbnail || null,
            type: row.type || null,
            price_rent: row.price_rent ? parseFloat(row.price_rent) : null,
            price_sell: row.price_sell ? parseFloat(row.price_sell) : null,
            slug: row.slug || null,
            path: row.path || null,
            Love_count: row.Love_count ? parseInt(row.Love_count) : 0,
            OwnerUserID: user.id || null,
          },
        });
      }
  
      console.log("Import successful!");

    
  } catch (error) {
    console.error("Error importing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importXlsx();