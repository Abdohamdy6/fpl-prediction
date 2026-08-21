const axios = require("axios");

async function verify() {
  const res = await axios.get("http://localhost:3001/api/proxy/gameweek?gw=1");
  console.log("Gameweek:", res.data.gameweek.name);
  console.log("Total Matches:", res.data.matches.length);
  for (const m of res.data.matches) {
    console.log(`- ${m.homeTeam.name} [${m.homeTeam.crestUrl}] vs ${m.awayTeam.name} [${m.awayTeam.crestUrl}] (${m.broadcastInfo})`);
  }
}

verify().catch(console.error);
