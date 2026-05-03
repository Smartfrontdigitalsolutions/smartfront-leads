const axios = require("axios");

async function scrapeGoogleMaps(query, limit = 25) {
  if (!process.env.OUTSCRAPER_API_KEY) {
    throw new Error("Missing OUTSCRAPER_API_KEY");
  }

  const url = "https://api.outscraper.cloud/google-maps-search";

  const response = await axios.get(url, {
    headers: {
      "X-API-KEY": process.env.OUTSCRAPER_API_KEY
    },
    params: {
      query,
      limit,
      async: "false"
    },
    timeout: 120000
  });

  const data = response.data;

  // Outscraper commonly returns nested arrays for search results.
  const results = Array.isArray(data?.data)
    ? data.data.flat()
    : Array.isArray(data)
      ? data.flat()
      : [];

  return results.map(normalizePlace).filter(Boolean);
}

function normalizePlace(place) {
  const name = place.name || place.title || place.business_name;
  const phone = place.phone || place.phone_number || place.site_phone;
  const website = place.site || place.website || place.url;
  const rating = Number(place.rating || place.google_rating || 0);
  const reviews = Number(place.reviews || place.reviews_count || place.review_count || 0);
  const address = place.full_address || place.address || "";
  const category = place.category || place.type || "";

  if (!name || !phone) return null;

  return {
    name,
    phone,
    website: website || "",
    rating,
    reviews,
    address,
    category
  };
}

module.exports = { scrapeGoogleMaps };
