# SmartFront Automated Lead Scraper — No GoHighLevel

This Railway-ready system scrapes and qualifies leads into **three separate Google Sheets tabs**:

1. **Website Leads**
   - Finds businesses with no website, poor website, or non-working website.
2. **AI Receptionist Leads**
   - Finds businesses where missed calls / booking / customer intake would be valuable.
3. **Review Boost Leads**
   - Finds businesses with low reviews, no reviews, weak ratings, or review problems.

## Flow

Outscraper → Qualification Logic → Google Sheets → Cold Caller

## Railway Setup

1. Upload this folder to GitHub.
2. Create a Railway project from the GitHub repo.
3. Add environment variables from `.env.example`.
4. Set the Railway start command to:

```bash
npm start
```

## Google Sheets Setup

Create a Google Sheet with 3 tabs exactly named:

- `Website Leads`
- `AI Receptionist Leads`
- `Review Boost Leads`

Add these headers to each tab:

```text
Date Added,Pipeline,Niche,Business Name,Phone,Website,Rating,Reviews,Address,City,Problem Found,Score,Qualification Reason,Status,Caller Notes
```

Share the Google Sheet with your Google service account email as Editor.

## Commands

Run all pipelines:

```bash
npm run run:all
```

Run only website leads:

```bash
npm run run:websites
```

Run only AI receptionist leads:

```bash
npm run run:ai
```

Run only review boost leads:

```bash
npm run run:reviews
```

## Notes

- This uses Outscraper’s Google Maps Search endpoint.
- It does not use GoHighLevel.
- It is designed for a cold caller to work directly from Google Sheets.
