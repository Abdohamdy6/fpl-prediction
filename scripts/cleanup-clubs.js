const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// The exact 20 Premier League clubs for 2026/27 season
const ACTIVE_PL_CLUB_IDS = [
  "3",   // Arsenal
  "7",   // Aston Villa
  "91",  // AFC Bournemouth
  "94",  // Brentford
  "36",  // Brighton & Hove Albion
  "8",   // Chelsea
  "9",   // Coventry City
  "31",  // Crystal Palace
  "11",  // Everton
  "54",  // Fulham
  "88",  // Hull City
  "40",  // Ipswich Town
  "2",   // Leeds United
  "14",  // Liverpool
  "43",  // Manchester City
  "1",   // Manchester United
  "4",   // Newcastle United
  "17",  // Nottingham Forest
  "6",   // Tottenham Hotspur
  "56",  // Sunderland
];

async function cleanup() {
  console.log("Cleaning up clubs in Neon PostgreSQL database...");

  // 1. Mark non-PL clubs as inactive
  const inactiveResult = await prisma.club.updateMany({
    where: {
      id: { notIn: ACTIVE_PL_CLUB_IDS },
    },
    data: {
      isActive: false,
    },
  });
  console.log(`Marked ${inactiveResult.count} Championship / historical clubs as inactive.`);

  // 2. Mark the 20 official PL clubs as active
  const activeResult = await prisma.club.updateMany({
    where: {
      id: { in: ACTIVE_PL_CLUB_IDS },
    },
    data: {
      isActive: true,
    },
  });
  console.log(`Marked ${activeResult.count} Premier League clubs as active.`);

  // 3. Verify active clubs count
  const activeClubs = await prisma.club.findMany({
    where: { isActive: true },
    select: { id: true, name: true, abbr: true },
    orderBy: { name: "asc" },
  });

  console.log(`\nVerified ${activeClubs.length} Active Premier League Clubs:`);
  for (const c of activeClubs) {
    console.log(`[${c.id}] ${c.name} (${c.abbr})`);
  }
}

cleanup()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
