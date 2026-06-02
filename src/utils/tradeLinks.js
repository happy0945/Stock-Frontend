
const OFFICIAL_STOCK_PAGES = {
  // NASDAQ listed
  AAPL:  "https://www.nasdaq.com/market-activity/stocks/aapl",
  TSLA:  "https://www.nasdaq.com/market-activity/stocks/tsla",
  MSFT:  "https://www.nasdaq.com/market-activity/stocks/msft",
  AMZN:  "https://www.nasdaq.com/market-activity/stocks/amzn",
  GOOGL: "https://www.nasdaq.com/market-activity/stocks/googl",
  NVDA:  "https://www.nasdaq.com/market-activity/stocks/nvda",
  META:  "https://www.nasdaq.com/market-activity/stocks/meta",
  NFLX:  "https://www.nasdaq.com/market-activity/stocks/nflx",
  INTC:  "https://www.nasdaq.com/market-activity/stocks/intc",
  AMD:   "https://www.nasdaq.com/market-activity/stocks/amd",

  // NYSE listed
  JPM:   "https://www.nyse.com/quote/XNYS:JPM",
  BAC:   "https://www.nyse.com/quote/XNYS:BAC",
  WMT:   "https://www.nyse.com/quote/XNYS:WMT",
  DIS:   "https://www.nyse.com/quote/XNYS:DIS",
  V:     "https://www.nyse.com/quote/XNYS:V",
  MA:    "https://www.nyse.com/quote/XNYS:MA",
};

// Fallback: dynamically generates NASDAQ URL for any unknown symbol
export const getTradeUrl = (symbol) => {
  if (!symbol) return "#";
  const upper = symbol.toUpperCase();
  return (
    OFFICIAL_STOCK_PAGES[upper] ||
    `https://www.nasdaq.com/market-activity/stocks/${upper.toLowerCase()}`
  );
};