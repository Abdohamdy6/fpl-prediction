const axios = require("axios");

const PL_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Origin": "https://www.premierleague.com",
  "Referer": "https://www.premierleague.com/",
  "Accept": "application/json, text/plain, */*",
};

async function check() {
  const url = "https://api.premierleague.com/broadcasting/match-events?sportDataId=2645209,2645211,2645205,2645208,2645214,2645207,2645210,2645213,2645212,2645206&pageSize=20";
  const res = await axios.get(url, { headers: PL_HEADERS });
  console.log("Broadcasting data sample:", JSON.stringify(res.data.content?.[0] || res.data[0], null, 2));
}

check();
