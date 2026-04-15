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