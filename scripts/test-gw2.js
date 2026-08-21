const axios = require("axios");

const PL_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Origin": "https://www.premierleague.com",
  "Referer": "https://www.premierleague.com/",
  "Accept": "application/json, text/plain, */*",
};

async function testGW2() {
  console.log("Testing PulseLive SDP for Matchweek 2...");
  try {
    const url = "https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v2/matches?competition=8&season=2026&matchweek=2&_limit=20";
    const res = await axios.get(url, { headers: PL_HEADERS, timeout: 8000 });
    console.log("PulseLive SDP GW2 items:", res.data?.data?.length || res.data?.content?.length || (Array.isArray(res.data) ? res.data.length : Object.keys(res.data)));
    console.log("Sample PulseLive match:", JSON.stringify((res.data?.data || res.data?.content || res.data)[0], null, 2));
  } catch (e) {
    console.error("PulseLive SDP error:", e.message);
  }

  console.log("\nTesting FPL Fixtures for Event 2...");
  try {
    const fplUrl = "https://fantasy.premierleague.com/api/fixtures/?event=2";
    const fplRes = await axios.get(fplUrl, { headers: PL_HEADERS, timeout: 8000 });
    console.log("FPL Event 2 matches count:", fplRes.data?.length);
    console.log("FPL Event 2 matches sample:", fplRes.data?.slice(0, 3));
  } catch (e) {
    console.error("FPL error:", e.message);
  }

  console.log("\nTesting Broadcasting endpoint for GW2 SportDataIds...");
  try {
    const bUrl = "https://api.premierleague.com/broadcasting/match-events?sportDataId=2645209,2645211,2645205,2645208,2645214,2645207,2645210,2645213,2645212,2645206&pageSize=20";
    const bRes = await axios.get(bUrl, { headers: PL_HEADERS, timeout: 8000 });
    console.log("Broadcasting items count:", bRes.data?.length || Object.keys(bRes.data));
  } catch (e) {
    console.error("Broadcasting error:", e.message);
  }
}

testGW2();
