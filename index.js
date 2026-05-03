require("dotenv").config();
const cron = require("node-cron");
const { runPipeline } = require("./src/pipeline");

const mode = process.argv[2] || "scheduled";

async function runSelected(selectedMode) {
  if (selectedMode === "websites") return runPipeline("websites");
  if (selectedMode === "ai") return runPipeline("ai");
  if (selectedMode === "reviews") return runPipeline("reviews");

  await runPipeline("websites");
  await runPipeline("ai");
  await runPipeline("reviews");
}

async function main() {
  console.log("SmartFront Lead Scraper — No GHL");
  console.log("Mode:", mode);

  if (["websites", "ai", "reviews", "all"].includes(mode)) {
    await runSelected(mode);
    process.exit(0);
  }

  if (process.env.RUN_ON_START === "true") {
    await runSelected("all");
  }

  const schedule = process.env.CRON_SCHEDULE || "0 8 * * *";
  console.log("Scheduled:", schedule);

  cron.schedule(schedule, async () => {
    try {
      await runSelected("all");
    } catch (err) {
      console.error("Scheduled run failed:", err.message);
    }
  });

  // Keep Railway service alive.
  require("http")
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("SmartFront Lead Scraper is running.");
    })
    .listen(process.env.PORT || 8080, () => {
      console.log("Server listening on port", process.env.PORT || 8080);
    });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
