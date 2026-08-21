const sampleKickoff = "2026-08-21T19:00:00.000Z";
const formatted = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Cairo",
}).format(new Date(sampleKickoff)) + " (Cairo)";

console.log("Original Kickoff (UTC):", sampleKickoff);
console.log("Displayed in UI (Cairo Time UTC+3):", formatted);
