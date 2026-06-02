# 📈 StockPulse — Live Market Terminal (Frontend)

Production-ready React frontend for the StockPulse real-time stock market backend.
Bloomberg Terminal-inspired aesthetic: deep navy base, amber/crimson data palette,
monospaced data font, live-streamed price ticks via Socket.io.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| State | Redux Toolkit |
| Real-time | Socket.io Client |
| Charts | Recharts |
| REST | Axios |
| Styling | CSS Modules + CSS Variables |
| Notifications | react-hot-toast |

---

## Folder Structure

```
src/
 ├── components/
 │    ├── common/
 │    │    ├── LiveBadge.jsx        # Pulsing LIVE/OFFLINE indicator
 │    │    ├── Spinner.jsx          # Loading spinner
 │    │    ├── ErrorBanner.jsx      # Error display with retry
 │    │    └── TickerTape.jsx       # Scrolling price marquee
 │    ├── dashboard/
 │    │    ├── Header.jsx           # Top nav with clock + live badge
 │    │    ├── WatchlistPanel.jsx   # Left sidebar symbol list
 │    │    └── MarketGrid.jsx       # Card grid overview
 │    ├── stock/
 │    │    ├── StockDetail.jsx      # Hero detail for selected symbol
 │    │    └── TradeLog.jsx         # Live trade event feed
 │    └── chart/
 │         └── PriceChart.jsx       # Recharts area chart
 ├── hooks/
 │    ├── useSocket.js              # Socket.io lifecycle + Redux dispatch
 │    ├── useStockData.js           # REST data loading + refresh
 │    └── useFlash.js               # Price change flash animation
 ├── pages/
 │    └── Dashboard.jsx             # Main layout assembly
 ├── services/
 │    ├── api.js                    # Axios REST client
 │    └── socket.js                 # Singleton Socket.io instance
 ├── store/
 │    ├── index.js                  # Redux store
 │    └── slices/
 │         └── stocksSlice.js       # All stock state + async thunks
 ├── utils/
 │    └── formatters.js             # Price/date/number formatters
 ├── styles/
 │    └── globals.css               # Design tokens + base styles
 ├── App.jsx                        # Root component
 └── main.jsx                       # Entry point
```

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Defaults point to localhost:5000 — no changes needed for local dev

# 3. Start the backend first (see stock-backend README)
cd ../stock-backend && npm run dev

# 4. Start the frontend
npm run dev
# → http://localhost:3000
```

---

## Features

- **Live ticker tape** — scrolling marquee of all watchlist symbols
- **Watchlist sidebar** — add/remove symbols, flash on price change
- **Stock detail panel** — full OHLC stats + last trade info
- **Area chart** — in-session price history, color-coded by direction
- **Market grid** — card overview of all symbols
- **Trade log** — chronological feed of latest ticks
- **Real-time updates** — Socket.io pushes price changes instantly
- **REST fallback** — periodic refresh every 30s if WebSocket is down
- **Flash animations** — green/red flash on every price tick
- **Feed status** — live/offline badge + fatal error banner

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Backend REST base URL |
| `VITE_WS_URL` | `http://localhost:5000` | Backend WebSocket URL |

---

## Production Build

```bash
npm run build
# Output → dist/
# Serve with: npx serve dist
```
