const { syncGameweek } = require("./src/lib/api/pl-client");

async function run() {
  console.log("Directly testing syncGameweek(2)...");
  const res = await syncGameweek(2);
  console.log("Result:", res);
}

run().catch(console.error);
