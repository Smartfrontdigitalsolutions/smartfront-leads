const { google } = require("googleapis");

const HEADERS = [
  "Date Added",
  "Pipeline",
  "Niche",
  "Business Name",
  "Phone",
  "Website",
  "Rating",
  "Reviews",
  "Address",
  "City",
  "Problem Found",
  "Score",
  "Qualification Reason",
  "Status",
  "Caller Notes"
];

async function getSheetsClient() {
  if (!process.env.GOOGLE_SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");
  }

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return google.sheets({ version: "v4", auth });
}

async function ensureHeaders(tabName) {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${tabName}!A1:O1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [HEADERS]
    }
  });
}

async function appendLead(tabName, row) {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${tabName}!A:O`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row]
    }
  });
}

module.exports = { ensureHeaders, appendLead };
