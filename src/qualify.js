const axios = require("axios");

async function qualifyLead(place, pipeline) {
  if (pipeline === "websites") return qualifyWebsiteLead(place);
  if (pipeline === "ai") return qualifyAIReceptionistLead(place);
  if (pipeline === "reviews") return qualifyReviewBoostLead(place);
  throw new Error(`Unknown pipeline: ${pipeline}`);
}

async function qualifyWebsiteLead(place) {
  let score = 0;
  const problems = [];

  if (!place.website) {
    score += 60;
    problems.push("No website found");
  } else {
    const siteStatus = await checkWebsite(place.website);
    if (!siteStatus.working) {
      score += 55;
      problems.push("Website appears non-working");
    }
    if (siteStatus.slowOrWeak) {
      score += 25;
      problems.push("Website may be weak/slow");
    }
  }

  if (place.reviews < 50) {
    score += 10;
    problems.push("Low review count");
  }

  return buildQualification(place, "Website Leads", score, problems);
}

async function qualifyAIReceptionistLead(place) {
  let score = 0;
  const problems = [];

  const serviceKeywords = [
    "roof", "plumb", "hvac", "electric", "landscap", "handyman",
    "clean", "med spa", "salon", "barber", "dentist", "chiropractor",
    "auto", "mechanic", "restaurant"
  ];

  const categoryText = `${place.category || ""} ${place.name || ""}`.toLowerCase();
  const serviceMatch = serviceKeywords.some(k => categoryText.includes(k));

  if (place.phone) {
    score += 30;
    problems.push("Has phone-based customer intake");
  }

  if (serviceMatch) {
    score += 30;
    problems.push("Service/local business likely receives calls");
  }

  if (!place.website) {
    score += 15;
    problems.push("No website, likely weak online booking/intake");
  }

  if (place.reviews >= 20) {
    score += 10;
    problems.push("Enough activity to benefit from call handling");
  }

  if (place.rating < 4.5 && place.reviews > 0) {
    score += 10;
    problems.push("Customer experience may need better follow-up");
  }

  return buildQualification(place, "AI Receptionist Leads", score, problems);
}

async function qualifyReviewBoostLead(place) {
  let score = 0;
  const problems = [];

  if (place.reviews === 0) {
    score += 70;
    problems.push("No Google reviews");
  } else if (place.reviews < 25) {
    score += 50;
    problems.push("Very low review count");
  } else if (place.reviews < 75) {
    score += 30;
    problems.push("Low review count");
  }

  if (place.rating > 0 && place.rating < 4.3) {
    score += 30;
    problems.push("Low Google rating");
  } else if (place.rating >= 4.3 && place.rating < 4.6) {
    score += 15;
    problems.push("Rating could be improved");
  }

  if (place.phone) {
    score += 10;
    problems.push("Callable lead");
  }

  return buildQualification(place, "Review Boost Leads", score, problems);
}

async function checkWebsite(rawUrl) {
  try {
    let url = rawUrl;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

    const start = Date.now();
    const response = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      validateStatus: status => status < 500
    });
    const elapsed = Date.now() - start;

    return {
      working: response.status >= 200 && response.status < 500,
      slowOrWeak: elapsed > 4500 || String(response.data || "").length < 1500
    };
  } catch (err) {
    return { working: false, slowOrWeak: false };
  }
}

function buildQualification(place, pipelineName, score, problems) {
  const qualified = score >= 60;

  return {
    qualified,
    score,
    problem: problems[0] || "Not enough problem indicators",
    reason: problems.join("; ") || "Did not qualify",
    pipelineName
  };
}

module.exports = { qualifyLead };
