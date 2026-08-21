const axios = require("axios");

async function testAutoSyncGW2() {
  console.log("Testing on-demand auto-sync for Gameweek 2...");
  const res = await axios.get("http://localhost:3002/api/proxy/gameweek?gw=2");
  console.log("Gameweek:", res.data.gameweek.name);
  console.log("Matches synced count:", res.data.matches.length);
  for (const m of res.data.matches) {
    console.log(`- ${m.homeTeam.name} (${m.homeTeam.crestUrl}) vs ${m.awayTeam.name} (${m.awayTeam.crestUrl}) | TV: ${m.broadcastInfo} | Kickoff: ${m.kickoffTime}`);
  }
}

testAutoSyncGW2().catch(console.error);
