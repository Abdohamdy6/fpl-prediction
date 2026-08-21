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
    return data.content || data.matches || data || [];
  } catch (error) {
    console.error(`Failed to fetch matches for Matchweek ${matchweek}:`, error);
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
    if (Array.isArray(data)) {
      for (const item of data) {
        const id = String(item.sportDataId || item.id);
        const broadcaster =
          item.programme?.broadcasters?.[0]?.name ||
          item.broadcasters?.[0]?.name ||
          "Sky Sports / TNT / beIN";
        broadcastMap[id] = broadcaster;
      }
    }
    return broadcastMap;
  } catch (error) {
    console.warn("Broadcasting fetch warning:", error);
    return {};
  }
}

/**
 * Sync Clubs into Database
 */
export async function syncClubs(): Promise<number> {
  const clubs = await fetchClubsMetadata();
  if (!clubs.length) return 0;

  let count = 0;
  for (const club of clubs) {
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
