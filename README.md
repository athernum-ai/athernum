# athernum
Spring 2026. University of Texas at Dallas, CS3354.004 Software Engineering, Team #3 "Athernum"


🌐 SEC EDGAR Public Resources
Main Website
EDGAR Database: https://www.sec.gov/
Public access to all filings
Can search by company name or CIK
Full filing documents available
CIK Lookup
Search at:https://www.sec.gov/search-filings
example :  
secEdgar.ts converts: AAPL → 0000320193 (CIK)
   ↓
Constructs URL: 
   https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json

   Backend (6 services):

secEdgar.ts - Fetches 10-K filings from SEC API using CIK
secSummarizer.ts - Generates 4-level summaries (mock version)
filingStorage.ts - Saves/retrieves filings from Supabase
filingImporter.ts - Runs complete pipeline
scheduler.ts - Auto-imports every 6 hours
supabaseClient.ts - Database connection
Frontend (3 components):

FilingArticleCard.tsx - Individual filing card
FilingSummaryViewer.tsx - 4-tab summary modal
FilingsDashboardPage.tsx - Dashboard with stats & table
Frontend Services (2):

feedFilings.ts - Fetches filings for Feed page
filingStats.ts - Gets dashboard statistics


How to Connect the AI

 AI should give  3 types of summaries so the website can show the "4 Levels" (Level 0 is the original text, which I already have).

Level 1: One short sentence.

Level 2: One paragraph (about 5-8 sentences).

Level 3: A list of 8-10 bullet points.

2. Where to put your code
You only need to look at two files in the project:

Create this file: lib/aiSummarizer.ts — Put your AI API call or model code here.

Change this file: lib/secSummarizer.ts — I have a fake function there. Just delete my fake code and call your summarizeWithAI function instead.



