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

   Backend (7 services):

secEdgar.ts - Fetches 10-K filings from SEC API using CIK
secSummarizer.ts - Generates 4-level summaries (mock version)
taggingService.ts - Auto-tags filings (Tech, Finance, Growth, Risk)
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
✅ Real SEC filing data in database
✅ Feed page displays latest filings
✅ Dashboard shows stats + full table
✅ 4-level summary viewer with tabs
✅ Auto-import every 6 hours
✅ 5 companies stored: AAPL, NVDA, TSLA, META, MSFT

How to Connect Your AI (Simplified Guide)
I have finished the Data Pipeline. The system is ready and waiting for your AI model. Here is the easiest way to connect it:

1. What the AI needs to send (Output)
Your AI should give me 3 types of summaries so the website can show the "4 Levels" (Level 0 is the original text, which I already have).

Level 1: One short sentence.

Level 2: One paragraph (about 5-8 sentences).

Level 3: A list of 8-10 bullet points.

2. Where to put your code
You only need to look at two files in the project:

Create this file: lib/aiSummarizer.ts — Put your AI API call or model code here.

Change this file: lib/secSummarizer.ts — I have a "mock" (fake) function there. Just delete my fake code and call your summarizeWithAI function instead.

3. How to test if it works
After you connect your AI, run this command in the terminal:
npm run import:test

If it works:

The terminal will show "Fetching from SEC..."

Your AI will generate the summaries.

The data will save to Supabase automatically.

You can open the Feed Page or Dashboard on the website to see your AI's summaries!

💡 Summary of the "Pipe" I built:
SEC API ➔ My Parser ➔ Your AI (Plug in here) ➔ My Database Logic ➔ My UI Display

The "Pipe" is 100% finished. Just plug in the AI and it's ready for the final demo!