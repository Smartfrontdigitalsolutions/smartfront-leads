const { scrapeGoogleMaps } = require("./outscraper");
const { qualifyLead } = require("./qualify");
const { ensureHeaders, appendLead } = require("./sheets");
const { MIN_LEADS, CITY, STATE, COUNTRY, niches, sheets } = require("./config");

const seenPhones = new Set();

async function runPipeline(pipeline) {
  const tabName = sheets[pipeline];
  if (!tabName) throw new Error(`No sheet tab configured for pipeline ${pipeline}`);

  console.log(`Running pipeline: ${pipeline} → ${tabName}`);
  await ensureHeaders(tabName);

  let saved = 0;

  for (const niche of niches) {
    if (saved >= MIN_LEADS) break;

    const query = `${niche} in ${CITY}, ${STATE}, ${COUNTRY}`;
    console.log(`Scraping: ${query}`);

    let places = [];
try {
  places = await scrapeGoogleMaps(query, 100);
} catch (err) {
  console.error(`Scrape failed for ${query}:`, err.message);
  continue;
}

    for (const place of places) {
      if (saved >= MIN_LEADS) break;
      if (!place.phone) continue;

      const dedupeKey = `${pipeline}:${place.phone}`;
      if (seenPhones.has(dedupeKey)) continue;
      seenPhones.add(dedupeKey);

      const qualification = await qualifyLead(place, pipeline);
      if (!qualification.qualified) continue;

      const row = [
        new Date().toISOString().slice(0, 10),
        qualification.pipelineName,
        niche,
        place.name,
        place.phone,
        place.website,
        place.rating,
        place.reviews,
        place.address,
        CITY,
        qualification.problem,
        qualification.score,
        qualification.reason,
        "New",
        ""
      ];

      await appendLead(tabName, row);
      saved += 1;
      console.log(`Saved ${saved}/${MIN_LEADS}: ${place.name}`);
    }
  }

  console.log(`Finished ${pipeline}. Saved ${saved} leads.`);
}

module.exports = { runPipeline };
