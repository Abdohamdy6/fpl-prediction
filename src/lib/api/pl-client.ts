import axios from "axios";
import { db } from "@/lib/db";

// Standard browser headers to bypass CORS and bot detection
const PL_DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Origin: "https://www.premierleague.com",
  Referer: "https://www.premierleague.com/",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-GB,en;q=0.9",
};

export interface ClubMetadataItem {
  id: number | string;
  name: string;
  shortName?: string;
  abbr?: string;
  badge?: string;
  ground?: {
    name?: string;
  };
  clubColors?: {
    primary?: string;
    secondary?: string;
  };
}

export const OFFICIAL_CLUB_MAP: Record<
  string,
  { shortName: string; abbr: string; primaryColor: string; secondaryColor: string }
> = {
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

// Map FPL team index (1-20) to Premier League official Club ID (Code)
export const FPL_ID_TO_CLUB_CODE: Record<number, string> = {
  1: "3",   // Arsenal
  2: "7",   // Aston Villa
  3: "91",  // Bournemouth
  4: "94",  // Brentford
  5: "36",  // Brighton
  6: "8",   // Chelsea
  7: "9",   // Coventry
  8: "31",  // Crystal Palace
  9: "11",  // Everton
  10: "54", // Fulham
  11: "88", // Hull City
  12: "40", // Ipswich
  13: "2",  // Leeds
  14: "14", // Liverpool
  15: "43", // Man City
  16: "1",  // Man Utd
  17: "4",  // Newcastle
  18: "17", // Nott'm Forest
  19: "6",  // Spurs
  20: "56", // Sunderland
};

/**
 * Fetch 20 Club profiles, colors, badges, and stadiums
 */
export async function fetchClubsMetadata(): Promise<ClubMetadataItem[]> {
  try {
    const { data } = await axios.get<ClubMetadataItem[]>(
      "https://resources.premierleague.com/premierleague25/config/clubs-metadata.json",
      { headers: PL_DEFAULT_HEADERS, timeout: 8000 }
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch clubs-metadata.json:", error);
    return [];
  }
}

/**
 * Fetch Current Active Gameweek
 */
export async function fetchCurrentGameweek(): Promise<number> {
  try {
    const { data } = await axios.get<{ gameweekNumber?: number; gameweek?: number }>(
      "https://resources.premierleague.com/premierleague25/config/current-gameweek.json",
      { headers: PL_DEFAULT_HEADERS, timeout: 6000 }
    );
    return data.gameweekNumber ?? data.gameweek ?? 1;
  } catch (error) {
    console.warn("Falling back to default Gameweek 1:", error);
    return 1;
  }
}

/**
 * Fetch Matches for a specific Matchweek (Gameweek) from PulseLive SDP
 */
export async function fetchGameweekMatches(matchweek: number, season = 2026): Promise<any[]> {
  try {
    const url = `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v2/matches?competition=8&season=${season}&matchweek=${matchweek}&_limit=20`;
    const { data } = await axios.get(url, { headers: PL_DEFAULT_HEADERS, timeout: 8000 });
    return data.data || data.content || data.matches || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(`Failed to fetch PulseLive matches for Matchweek ${matchweek}:`, error);
    return [];
  }
}

/**
 * Fallback: Fetch Fixtures from Fantasy Premier League endpoint
 */
export async function fetchFPLFixtures(event: number): Promise<any[]> {
  try {
    const url = `https://fantasy.premierleague.com/api/fixtures/?event=${event}`;
    const { data } = await axios.get(url, { headers: PL_DEFAULT_HEADERS, timeout: 8000 });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to fetch FPL fixtures for Event ${event}:`, error);
    return [];
  }
}

/**
 * Fetch Broadcasting and TV Network details by sportDataIds
 */
export async function fetchBroadcastDetails(sportDataIds: string[]): Promise<Record<string, string>> {
  if (!sportDataIds.length) return {};
  try {
    const url = `https://api.premierleague.com/broadcasting/match-events?sportDataId=${sportDataIds.join(",")}&pageSize=20`;
    const { data } = await axios.get(url, { headers: PL_DEFAULT_HEADERS, timeout: 8000 });

    const broadcastMap: Record<string, string> = {};
    const items = data.content || data.data || (Array.isArray(data) ? data : []);

    for (const item of items) {
      const id = String(item.contentReference?.id || item.sportDataId || item.id);
      let channelName = "Sky Sports / TNT / beIN";

      if (item.programmes && item.programmes.length > 0) {
        const prog = item.programmes[0];
        if (prog.channels && prog.channels.length > 0) {
          channelName = prog.channels[0].name || channelName;
        } else if (prog.broadcasters && prog.broadcasters.length > 0) {
          channelName = prog.broadcasters[0].name || channelName;
        }
      } else if (item.broadcasters && item.broadcasters.length > 0) {
        channelName = item.broadcasters[0].name || channelName;
      }

      broadcastMap[id] = channelName;
    }

    return broadcastMap;
  } catch (error) {
    console.warn("Broadcasting fetch warning:", error);
    return {};
  }
}

/**
 * Sync All 20 Clubs into Database
 */
export async function syncClubs(): Promise<number> {
  const clubs = await fetchClubsMetadata();
  const clubsToProcess = clubs.length > 0 ? clubs : Object.entries(OFFICIAL_CLUB_MAP).map(([id, meta]) => ({
    id,
    name: meta.shortName,
    shortName: meta.shortName,
    abbr: meta.abbr,
  }));

  let count = 0;
  for (const club of clubsToProcess) {
    const id = String(club.id);
    const meta = OFFICIAL_CLUB_MAP[id];
    const name = club.name || meta?.shortName || `Club ${id}`;
    const shortName = meta?.shortName || club.shortName || name;
    const abbr = meta?.abbr || club.abbr || shortName.slice(0, 3).toUpperCase();
    const badgeUrl = `https://resources.premierleague.com/premierleague25/badges-alt/${id}.svg`;

    await db.club.upsert({
      where: { id },
      update: {
        name,
        shortName,
        abbr,
        crestUrl: badgeUrl,
        primaryColor: meta?.primaryColor || club.clubColors?.primary || "#38003C",
        secondaryColor: meta?.secondaryColor || club.clubColors?.secondary || "#00FF85",
        stadiumName: club.ground?.name || "Premier League Stadium",
        updatedAt: new Date(),
      },
      create: {
        id,
        name,
        shortName,
        abbr,
        crestUrl: badgeUrl,
        primaryColor: meta?.primaryColor || club.clubColors?.primary || "#38003C",
        secondaryColor: meta?.secondaryColor || club.clubColors?.secondary || "#00FF85",
        stadiumName: club.ground?.name || "Premier League Stadium",
      },
    });
    count++;
  }
  return count;
}

/**
 * Automatically Sync Any Gameweek from Premier League Endpoints (PulseLive SDP & Broadcasting)
 */
export async function syncGameweek(gameweekNumber: number): Promise<{
  gameweek: number;
  matchesSynced: number;
}> {
  console.log(`[Auto-Sync] Fetching Premier League feeds for Gameweek ${gameweekNumber}...`);
  await syncClubs();

  // 1. Try PulseLive SDP
  let matchesData = await fetchGameweekMatches(gameweekNumber);
  let isPulseLive = true;

  // 2. If PulseLive is empty, fallback to FPL fixtures
  if (!matchesData || matchesData.length === 0) {
    console.log(`[Auto-Sync] Falling back to FPL fixtures for GW ${gameweekNumber}...`);
    matchesData = await fetchFPLFixtures(gameweekNumber);
    isPulseLive = false;
  }

  if (!matchesData || matchesData.length === 0) {
    console.warn(`[Auto-Sync] No matches found for GW ${gameweekNumber}`);
    return { gameweek: gameweekNumber, matchesSynced: 0 };
  }

  // 3. Extract sportDataIds to fetch TV broadcast info
  const sportDataIds: string[] = [];
  for (const m of matchesData) {
    const id = isPulseLive ? String(m.matchId || m.id) : String(m.code || m.id);
    if (id) sportDataIds.push(id);
  }

  const broadcastMap = await fetchBroadcastDetails(sportDataIds);

  // 4. Calculate earliest kickoff as Gameweek deadline
  let earliestKickoff: Date | null = null;
  const parsedMatches: Array<{
    sportDataId: string;
    homeTeamId: string;
    awayTeamId: string;
    kickoffTime: Date;
    broadcastInfo: string;
    status: string;
  }> = [];

  for (const m of matchesData) {
    let sportDataId: string;
    let homeTeamId: string;
    let awayTeamId: string;
    let kickoffTime: Date;
    let status = "SCHEDULED";

    if (isPulseLive) {
      sportDataId = String(m.matchId || m.id);
      homeTeamId = String(m.homeTeam?.id || m.teams?.[0]?.team?.id);
      awayTeamId = String(m.awayTeam?.id || m.teams?.[1]?.team?.id);

      const kickoffStr = m.kickoff || m.kickoffTime || m.kickoffTimezone;
      kickoffTime = kickoffStr ? new Date(kickoffStr) : new Date();

      if (m.period === "FullTime" || m.status === "C") status = "FINISHED";
      else if (m.period === "FirstHalf" || m.period === "SecondHalf" || m.status === "I") status = "IN_PLAY";
    } else {
      // FPL format
      sportDataId = String(m.code || m.id);
      homeTeamId = FPL_ID_TO_CLUB_CODE[m.team_h] || String(m.team_h);
      awayTeamId = FPL_ID_TO_CLUB_CODE[m.team_a] || String(m.team_a);
      kickoffTime = m.kickoff_time ? new Date(m.kickoff_time) : new Date();

      if (m.finished) status = "FINISHED";
      else if (m.started) status = "IN_PLAY";
    }

    if (!earliestKickoff || kickoffTime < earliestKickoff) {
      earliestKickoff = kickoffTime;
    }

    const broadcast = broadcastMap[sportDataId] || (
      isPulseLive ? "Sky Sports / beIN / TOD" : "Premier League Live"
    );

    parsedMatches.push({
      sportDataId,
      homeTeamId,
      awayTeamId,
      kickoffTime,
      broadcastInfo: broadcast,
      status,
    });
  }

  // Set Gameweek deadline to 90 minutes before first match
  const deadline = earliestKickoff
    ? new Date(earliestKickoff.getTime() - 90 * 60 * 1000)
    : new Date();

  // 5. Upsert Gameweek in DB
  const currentGw = await fetchCurrentGameweek();
  await db.gameweek.upsert({
    where: { id: gameweekNumber },
    update: {
      name: `Gameweek ${gameweekNumber}`,
      deadline,
      isCurrent: gameweekNumber === currentGw,
    },
    create: {
      id: gameweekNumber,
      name: `Gameweek ${gameweekNumber}`,
      deadline,
      isCurrent: gameweekNumber === currentGw,
    },
  });

  // 6. Upsert All Matches in DB
  let synced = 0;
  for (const match of parsedMatches) {
    // Ensure home and away clubs exist
    await db.match.upsert({
      where: { sportDataId: match.sportDataId },
      update: {
        gameweekId: gameweekNumber,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        kickoffTime: match.kickoffTime,
        lockTime: match.kickoffTime,
        broadcastInfo: match.broadcastInfo,
        status: match.status,
      },
      create: {
        sportDataId: match.sportDataId,
        gameweekId: gameweekNumber,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        kickoffTime: match.kickoffTime,
        lockTime: match.kickoffTime,
        broadcastInfo: match.broadcastInfo,
        status: match.status,
      },
    });
    synced++;
  }

  console.log(`[Auto-Sync] Gameweek ${gameweekNumber} synced successfully (${synced} fixtures)!`);
  return { gameweek: gameweekNumber, matchesSynced: synced };
}
