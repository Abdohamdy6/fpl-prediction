const axios = require("axios");

const PL_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Origin": "https://www.premierleague.com",
  "Referer": "https://www.premierleague.com/",
  "Accept": "application/json, text/plain, */*",
};

async function check() {
  console.log("=== 1. FETCHING CLUBS METADATA ===");
  try {
    const res = await axios.get("https://resources.premierleague.com/premierleague25/config/clubs-metadata.json", {
      headers: PL_HEADERS,
      timeout: 8000
    });
    console.log("Found clubs:", res.data.length);
    for (const c of res.data) {
      console.log(`ID: ${c.id} | Name: ${c.name} | Short: ${c.shortName} | Abbr: ${c.abbr} | Badge: ${c.badge}`);
    }
  } catch (err) {
    console.error("Clubs metadata error:", err.message);
  }

  console.log("\n=== 2. FETCHING FPL FIXTURES FOR GW1 ===");
  try {
    const res = await axios.get("https://fantasy.premierleague.com/api/fixtures/?event=1", {
      headers: PL_HEADERS,
      timeout: 8000
    });
    console.log("GW1 Fixtures from FPL:", res.data.length);
    for (const f of res.data) {
      console.log(`Match ID: ${f.id} | Team H: ${f.team_h} vs Team A: ${f.team_a} | Kickoff: ${f.kickoff_time}`);
    }
  } catch (err) {
    console.error("FPL fixtures error:", err.message);
  }

  console.log("\n=== 3. FETCHING FPL TEAMS (BOOTSTRAP) ===");
  try {
    const res = await axios.get("https://fantasy.premierleague.com/api/bootstrap-static/", {
      headers: PL_HEADERS,
      timeout: 8000
    });
    console.log("FPL Teams count:", res.data.teams.length);
    for (const t of res.data.teams) {
      console.log(`FPL ID: ${t.id} | Name: ${t.name} | Short: ${t.short_name} | Code: ${t.code}`);
    }
  } catch (err) {
    console.error("FPL bootstrap error:", err.message);
  }
}

check();
