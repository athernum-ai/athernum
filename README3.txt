README 3: Simple Manual Test Cases

1. Sign up
- Open the app.
- Create a new account with email and password.
- Expected result: account is created, or a confirmation message appears.

2. Sign in
- Sign in with a valid account.
- Expected result: the user is logged in and protected features become available.

3. Ticker search
- Type at least 2 characters in the search bar, such as `AA` or `Apple`.
- Expected result: matching ticker results appear.

4. Sync ticker
- While signed in, open a ticker from search.
- Expected result: the app syncs the ticker data and opens the ticker detail page.

5. Add to watchlist
- Open a ticker detail page and click `Add to Watchlist`.
- Expected result: the ticker is added to the watchlist.

6. Remove from watchlist
- On a ticker already in the watchlist, click `Remove from Watchlist`.
- Expected result: the ticker is removed from the watchlist.

7. Persistence after refresh
- Add a ticker to the watchlist, then refresh the page.
- Expected result: the watchlist still shows the saved ticker after reload.

8. Protected and auth behavior
- While signed out, try to open protected pages or actions like watchlist save, filings dashboard, events, settings, or AI summaries.
- Expected result: the app asks the user to sign in instead of allowing full access.
