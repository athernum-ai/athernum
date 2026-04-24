README 1: How to Run the Project

1. Open a terminal in the project folder.

2. Install packages:
npm install

3. Create a `.env.local` file with placeholder values:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FMP_API_KEY=your_fmp_api_key

4. Start the app:
npm run dev

5. Open the local URL shown in the terminal.

Main app features:
- User sign in and sign up with Supabase Auth
- Stock ticker search
- Ticker detail page with chart, stats, and AI summary tabs
- Personal watchlist saved for each user
- Feed page with market content
- Filings dashboard for SEC filing summaries
- Protected pages and actions for signed-in users
