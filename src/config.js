const MIN_LEADS = Number(process.env.MIN_LEADS_PER_PIPELINE || 75);
const CITY = process.env.CITY || "Las Vegas";
const STATE = process.env.STATE || "NV";
const COUNTRY = process.env.COUNTRY || "USA";

const niches = [
  "roofers",
  "plumbers",
  "HVAC companies",
  "electricians",
  "landscapers",
  "handyman services",
  "cleaning companies",
  "auto detailers",
  "barbershops",
  "salons",
  "med spas",
  "dentists",
  "chiropractors",
  "restaurants",
  "mobile mechanics"
];

const sheets = {
  websites: "Website Leads",
  ai: "AI Receptionist Leads",
  reviews: "Review Boost Leads"
};

module.exports = {
  MIN_LEADS,
  CITY,
  STATE,
  COUNTRY,
  niches,
  sheets
};
