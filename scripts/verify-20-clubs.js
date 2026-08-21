const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verify() {
  const clubs = await prisma.club.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  console.log("Total Active Premier League Clubs in DB:", clubs.length);
  clubs.forEach((c, i) => {
    console.log(`${i + 1}. [ID: ${c.id}] ${c.name} (${c.abbr})`);
  });

  await prisma.$disconnect();
}

verify().catch(console.error);
