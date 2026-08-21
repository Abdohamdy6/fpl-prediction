const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const prisma = new PrismaClient();

const PL_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Origin: "https://www.premierleague.com",
  Referer: "https://www.premierleague.com/",
  Accept: "application/json, text/plain, */*",
};

const OFFICIAL_CLUB_MAP = {
  "3": { shortName: "Arsenal", abbr: "ARS", primaryColor: "#EF0107", secondaryColor: "#063672" },
  "7": { shortName: "Aston Villa", abbr: "AVL", primaryColor: "#95BFE5", secondaryColor: "#670E36" },
  "91": { shortName: "Bournemouth", abbr: "BOU", primaryColor: "#DA291C", secondaryColor: "#000000" },
  "94": { shortName: "Brentford", abbr: "BRE", primaryColor: "#E30613", secondaryColor: "#FEEB00" },
  "36": { shortName: "Brighton", abbr: "BHA", primaryColor: "#0057B8", secondaryColor: "#FFCD00" },
  "8": { shortName: "Chelsea", abbr: "CHE", primaryColor: "#034694", secondaryColor: "#EE242C" },
  "9": { shortName: "Coventry", abbr: "COV", primaryColor: "#00A8B5", secondaryColor: "#002B49" },
  "31": { shortName: "Crystal Palace", abbr: "CRY", primaryColor: "#1B458F", secondaryColor: "#C4122E" },
  "11": { shortName: "Everton", abbr: "EVE", primaryColor: "#003399", secondaryColor: "#FFFFFF" },
  "54": { shortName: "Fulham", abbr: "FUL", primaryColor: "#000000", secondaryColor: "#CC0000" },
  "88": { shortName: "Hull City", abbr: "HUL", primaryColor: "#F5971D", secondaryColor: "#000000" },
  "40": { shortName: "Ipswich", abbr: "IPS", primaryColor: "#003399", secondaryColor: "#FFFFFF" },
  "2": { shortName: "Leeds", abbr: "LEE", primaryColor: "#FFCD00", secondaryColor: "#1D428A" },
  "14": { shortName: "Liverpool", abbr: "LIV", primaryColor: "#C8102E", secondaryColor: "#00B2A9" },
  "43": { shortName: "Man City", abbr: "MCI", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B" },
  "1": { shortName: "Man Utd", abbr: "MUN", primaryColor: "#DA291C", secondaryColor: "#FBE122" },
  "4": { shortName: "Newcastle", abbr: "NEW", primaryColor: "#241F20", secondaryColor: "#41B6E6" },
  "17": { shortName: "Nott'm Forest", abbr: "NFO", primaryColor: "#DD0000", secondaryColor: "#FFFFFF" },
  "6": { shortName: "Spurs", abbr: "TOT", primaryColor: "#132257", secondaryColor: "#FFFFFF" },
  "56": { shortName: "Sunderland", abbr: "SUN", primaryColor: "#EB172B", secondaryColor: "#000000" },
  "21": { shortName: "West Ham", abbr: "WHU", primaryColor: "#7A263A", secondaryColor: "#1BB1E7" },
  "39": { shortName: "Wolves", abbr: "WOL", primaryColor: "#FDB913", secondaryColor: "#231F20" },
};

async function syncFutureGameweek(gw) {
  console.log(`\n=== SYNCING GAMEWEEK ${gw} ===`);
  const url = `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v2/matches?competition=8&season=2026&matchweek=${gw}&_limit=20`;
  const res = await axios.get(url, { headers: PL_HEADERS, timeout: 8000 });
  const matches = res.data?.data || res.data?.content || res.data || [];

  if (!matches.length) {
    console.log(`No matches returned for GW ${gw}`);
    return 0;
  }

  // Get broadcast info
  const sportDataIds = matches.map((m) => String(m.matchId || m.id)).filter(Boolean);
  let broadcastMap = {};
  try {
    const bUrl = `https://api.premierleague.com/broadcasting/match-events?sportDataId=${sportDataIds.join(",")}&pageSize=20`;
    const bRes = await axios.get(bUrl, { headers: PL_HEADERS, timeout: 8000 });
    const bItems = bRes.data?.content || bRes.data || [];
    for (const item of bItems) {
      const id = String(item.contentReference?.id || item.sportDataId || item.id);
      let channel = "Sky Sports / TNT / beIN";
      if (item.programmes?.[0]?.channels?.[0]?.name) channel = item.programmes[0].channels[0].name;
      else if (item.broadcasters?.[0]?.name) channel = item.broadcasters[0].name;
      broadcastMap[id] = channel;
    }
  } catch (e) {
    console.warn("Broadcast warning:", e.message);
  }

  // Calculate earliest kickoff
  let earliestKickoff = null;
  for (const m of matches) {
    const kickoff = new Date(m.kickoff);
    if (!earliestKickoff || kickoff < earliestKickoff) earliestKickoff = kickoff;
  }

  const deadline = earliestKickoff
    ? new Date(earliestKickoff.getTime() - 90 * 60 * 1000)
    : new Date();

  // Upsert Gameweek
  await prisma.gameweek.upsert({
    where: { id: gw },
    update: {
      name: `Gameweek ${gw}`,
      deadline,
      isCurrent: gw === 1,
    },
    create: {
      id: gw,
      name: `Gameweek ${gw}`,
      deadline,
      isCurrent: gw === 1,
    },
  });

  // Upsert Matches
  for (const m of matches) {
    const sportDataId = String(m.matchId || m.id);
    const homeTeamId = String(m.homeTeam?.id);
    const awayTeamId = String(m.awayTeam?.id);
    const kickoffTime = new Date(m.kickoff);
    const broadcastInfo = broadcastMap[sportDataId] || "beIN Sports / TOD";

    // Ensure club records exist
    if (OFFICIAL_CLUB_MAP[homeTeamId]) {
      await prisma.club.upsert({
        where: { id: homeTeamId },
        update: { name: m.homeTeam.name, abbr: OFFICIAL_CLUB_MAP[homeTeamId].abbr },
        create: {
          id: homeTeamId,
          name: m.homeTeam.name,
          shortName: OFFICIAL_CLUB_MAP[homeTeamId].shortName,
          abbr: OFFICIAL_CLUB_MAP[homeTeamId].abbr,
          crestUrl: `https://resources.premierleague.com/premierleague25/badges-alt/${homeTeamId}.svg`,
        },
      });
    }

    if (OFFICIAL_CLUB_MAP[awayTeamId]) {
      await prisma.club.upsert({
        where: { id: awayTeamId },
        update: { name: m.awayTeam.name, abbr: OFFICIAL_CLUB_MAP[awayTeamId].abbr },
        create: {
          id: awayTeamId,
          name: m.awayTeam.name,
          shortName: OFFICIAL_CLUB_MAP[awayTeamId].shortName,
          abbr: OFFICIAL_CLUB_MAP[awayTeamId].abbr,
          crestUrl: `https://resources.premierleague.com/premierleague25/badges-alt/${awayTeamId}.svg`,
        },
      });
    }

    await prisma.match.upsert({
      where: { sportDataId },
      update: {
        gameweekId: gw,
        homeTeamId,
        awayTeamId,
        kickoffTime,
        lockTime: kickoffTime,
        broadcastInfo,
        status: "SCHEDULED",
      },
      create: {
        sportDataId,
        gameweekId: gw,
        homeTeamId,
        awayTeamId,
        kickoffTime,
        lockTime: kickoffTime,
        broadcastInfo,
        status: "SCHEDULED",
      },
    });

    console.log(`- ${m.homeTeam.name} vs ${m.awayTeam.name} (${broadcastInfo})`);
  }

  console.log(`✅ GW ${gw} Synced Successfully! (${matches.length} fixtures)`);
  return matches.length;
}

async function main() {
  const gwsToSync = [2, 3, 4, 5];
  for (const gw of gwsToSync) {
    try {
      await syncFutureGameweek(gw);
    } catch (e) {
      console.error(`Failed to sync GW ${gw}:`, e.message);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
