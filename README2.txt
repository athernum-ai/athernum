README 2: How Data Collection Works

This project collects stock and filing data from a few sources.

1. FMP API ticker sync
- Ticker search uses the FMP API to find symbols.
- When a user opens a ticker from search, the app can sync that ticker into the `tickers` table.
- There is also a symbol directory sync route that can pull many symbols from FMP into Supabase.
- Watchlist sync can refresh saved watchlist tickers from FMP data.

2. Supabase storage
- Supabase stores users, watchlists, tickers, articles, securities, and filings.
- Watchlist data stays saved after refresh when the same user signs in again.
- Filing summaries are also saved in Supabase for the filings dashboard.

3. SEC/EDGAR filing collection
- This project includes SEC/EDGAR filing collection.
- The filing route and import script fetch recent 10-K and 10-Q filing data for supported tickers.
- The importer gets filing data, creates summaries, and saves the results to Supabase.
- SEC/EDGAR data does not use an API key here, but Supabase setup is still needed to save results.

How to test data collection:
- Run the app with `npm run dev`.
- Search for a ticker such as `AAPL` and open it to test single ticker sync.
- Visit the app features that use saved ticker data and watchlist data.
- Run `npm run import:test` to test filing import from the terminal.
- Open the Filings Dashboard to check whether filing records were saved and displayed.
