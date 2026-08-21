import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PL_CLUBS = [
  { id: "1", name: "Arsenal", shortName: "Arsenal", abbr: "ARS", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/1.svg", primaryColor: "#EF0107", secondaryColor: "#063672", stadiumName: "Emirates Stadium" },
  { id: "2", name: "Aston Villa", shortName: "Aston Villa", abbr: "AVL", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/2.svg", primaryColor: "#95BFE5", secondaryColor: "#670E36", stadiumName: "Villa Park" },
  { id: "3", name: "AFC Bournemouth", shortName: "Bournemouth", abbr: "BOU", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/91.svg", primaryColor: "#DA291C", secondaryColor: "#000000", stadiumName: "Vitality Stadium" },
  { id: "4", name: "Brentford", shortName: "Brentford", abbr: "BRE", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/94.svg", primaryColor: "#E30613", secondaryColor: "#FEEB00", stadiumName: "Gtech Community Stadium" },
  { id: "5", name: "Brighton & Hove Albion", shortName: "Brighton", abbr: "BHA", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/36.svg", primaryColor: "#0057B8", secondaryColor: "#FFCD00", stadiumName: "Amex Stadium" },
  { id: "6", name: "Chelsea", shortName: "Chelsea", abbr: "CHE", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/8.svg", primaryColor: "#034694", secondaryColor: "#EE242C", stadiumName: "Stamford Bridge" },
  { id: "7", name: "Crystal Palace", shortName: "Crystal Palace", abbr: "CRY", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/31.svg", primaryColor: "#1B458F", secondaryColor: "#C4122E", stadiumName: "Selhurst Park" },
  { id: "8", name: "Everton", shortName: "Everton", abbr: "EVE", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/11.svg", primaryColor: "#003399", secondaryColor: "#FFFFFF", stadiumName: "Goodison Park" },
  { id: "9", name: "Fulham", shortName: "Fulham", abbr: "FUL", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/54.svg", primaryColor: "#000000", secondaryColor: "#CC0000", stadiumName: "Craven Cottage" },
  { id: "10", name: "Ipswich Town", shortName: "Ipswich", abbr: "IPS", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/40.svg", primaryColor: "#003399", secondaryColor: "#FFFFFF", stadiumName: "Portman Road" },
  { id: "11", name: "Leicester City", shortName: "Leicester", abbr: "LEI", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/14.svg", primaryColor: "#003090", secondaryColor: "#FDBE11", stadiumName: "King Power Stadium" },
  { id: "12", name: "Liverpool", shortName: "Liverpool", abbr: "LIV", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/14.svg", primaryColor: "#C8102E", secondaryColor: "#00B2A9", stadiumName: "Anfield" },
  { id: "13", name: "Manchester City", shortName: "Man City", abbr: "MCI", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/43.svg", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B", stadiumName: "Etihad Stadium" },
  { id: "14", name: "Manchester United", shortName: "Man Utd", abbr: "MUN", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/1.svg", primaryColor: "#DA291C", secondaryColor: "#FBE122", stadiumName: "Old Trafford" },
  { id: "15", name: "Newcastle United", shortName: "Newcastle", abbr: "NEW", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/4.svg", primaryColor: "#241F20", secondaryColor: "#41B6E6", stadiumName: "St. James' Park" },
  { id: "16", name: "Nottingham Forest", shortName: "Nott'm Forest", abbr: "NFO", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/17.svg", primaryColor: "#DD0000", secondaryColor: "#FFFFFF", stadiumName: "City Ground" },
  { id: "17", name: "Southampton", shortName: "Southampton", abbr: "SOU", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/56.svg", primaryColor: "#D71920", secondaryColor: "#130C0E", stadiumName: "St. Mary's Stadium" },
  { id: "18", name: "Tottenham Hotspur", shortName: "Spurs", abbr: "TOT", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/6.svg", primaryColor: "#132257", secondaryColor: "#FFFFFF", stadiumName: "Tottenham Hotspur Stadium" },
  { id: "19", name: "West Ham United", shortName: "West Ham", abbr: "WHU", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/7.svg", primaryColor: "#7A263A", secondaryColor: "#1BB1E7", stadiumName: "London Stadium" },
  { id: "20", name: "Wolverhampton Wanderers", shortName: "Wolves", abbr: "WOL", crestUrl: "https://resources.premierleague.com/premierleague25/badges-alt/3.svg", primaryColor: "#FDB913", secondaryColor: "#231F20", stadiumName: "Molineux Stadium" },
];

async function main() {
  console.log("Seeding Premier League clubs...");
  for (const club of PL_CLUBS) {
    await prisma.club.upsert({
      where: { id: club.id },
      update: club,
      create: club,
    });
  }

  console.log("Seeding Gameweek 1...");
  const deadline = new Date(Date.now() + 86400000 * 2); // 2 days in future
  await prisma.gameweek.upsert({
    where: { id: 1 },
    update: { isCurrent: true, deadline },
    create: {
      id: 1,
      name: "Gameweek 1",
      deadline,
      isCurrent: true,
    },
  });

  console.log("Seeding 10 Gameweek 1 Fixtures...");
  const fixturePairings = [
    { sportDataId: "2645195", home: "1", away: "6", kickoff: new Date(Date.now() + 86400000 * 2), broadcast: "Sky Sports Premier League" }, // ARS vs CHE
    { sportDataId: "2645198", home: "13", away: "14", kickoff: new Date(Date.now() + 86400000 * 2 + 7200000), broadcast: "TNT Sports 1" }, // MCI vs MUN
    { sportDataId: "2645197", home: "12", away: "2", kickoff: new Date(Date.now() + 86400000 * 2 + 7200000), broadcast: "Sky Sports Main Event" }, // LIV vs AVL
    { sportDataId: "2645199", home: "18", away: "15", kickoff: new Date(Date.now() + 86400000 * 2 + 14400000), broadcast: "Sky Sports Premier League" }, // TOT vs NEW
    { sportDataId: "2645200", home: "19", away: "8", kickoff: new Date(Date.now() + 86400000 * 2 + 14400000), broadcast: "beIN Sports / TOD" }, // WHU vs EVE
    { sportDataId: "2645196", home: "5", away: "9", kickoff: new Date(Date.now() + 86400000 * 2 + 14400000), broadcast: "beIN Sports / TOD" }, // BHA vs FUL
    { sportDataId: "2645201", home: "4", away: "7", kickoff: new Date(Date.now() + 86400000 * 3), broadcast: "Sky Sports Premier League" }, // BRE vs CRY
    { sportDataId: "2645202", home: "16", away: "3", kickoff: new Date(Date.now() + 86400000 * 3), broadcast: "TNT Sports 1" }, // NFO vs BOU
    { sportDataId: "2645203", home: "11", away: "10", kickoff: new Date(Date.now() + 86400000 * 3 + 7200000), broadcast: "beIN Sports / TOD" }, // LEI vs IPS
    { sportDataId: "2645204", home: "20", away: "17", kickoff: new Date(Date.now() + 86400000 * 3 + 14400000), broadcast: "Sky Sports Main Event" }, // WOL vs SOU
  ];

  for (const f of fixturePairings) {
    await prisma.match.upsert({
      where: { sportDataId: f.sportDataId },
      update: {
        gameweekId: 1,
        homeTeamId: f.home,
        awayTeamId: f.away,
        kickoffTime: f.kickoff,
        lockTime: f.kickoff,
        broadcastInfo: f.broadcast,
      },
      create: {
        sportDataId: f.sportDataId,
        gameweekId: 1,
        homeTeamId: f.home,
        awayTeamId: f.away,
        kickoffTime: f.kickoff,
        lockTime: f.kickoff,
        broadcastInfo: f.broadcast,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
