/**
 * src/store/slices/stocksSlice.js
 *
 * Redux slice for all stock market state:
 *  - quotes map (symbol → quote object)
 *  - live trades (latest trade per symbol)
 *  - price history per symbol (for sparkline charts)
 *  - watchlist (user's selected symbols)
 *  - loading/error states
 *  - WebSocket feed status
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMultipleQuotes,
  fetchSubscriptions,
  subscribeSymbol as apiSubscribe,
  unsubscribeSymbol as apiUnsubscribe,
} from "@/services/api";

// Max data points kept per symbol in history (for sparklines)
const MAX_HISTORY = 60;

// Default watchlist
const DEFAULT_WATCHLIST = ["AAPL", "TSLA", "MSFT", "AMZN", "GOOGL", "NVDA"];

// ── Async thunks ─────────────────────────────────────────────────────────────

export const loadQuotes = createAsyncThunk(
  "stocks/loadQuotes",
  async (symbols, { rejectWithValue }) => {
    try {
      const response = await fetchMultipleQuotes(symbols);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadSubscriptions = createAsyncThunk(
  "stocks/loadSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSubscriptions();
      return response.data.symbols;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  "stocks/addToWatchlist",
  async (symbol, { rejectWithValue }) => {
    try {
      await apiSubscribe(symbol);
      return symbol.toUpperCase();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  "stocks/removeFromWatchlist",
  async (symbol, { rejectWithValue }) => {
    try {
      await apiUnsubscribe(symbol);
      return symbol.toUpperCase();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const stocksSlice = createSlice({
  name: "stocks",
  initialState: {
    // symbol → quote object
    quotes: {},
    // symbol → latest trade object
    trades: {},
    // symbol → array of { price, timestamp } (max MAX_HISTORY)
    history: {},
    // user's watchlist
    watchlist: DEFAULT_WATCHLIST,
    // currently selected symbol for the detail view
    selectedSymbol: DEFAULT_WATCHLIST[0],
    // backend WS feed status
    feedConnected: false,
    feedFatal: false,
    // REST loading states
    loading: false,
    error: null,
    // per-symbol flash state for price change animations
    flashState: {}, // symbol → "gain" | "loss" | null
  },
  reducers: {
    // Called by useSocket when a live trade arrives
    tradeTick(state, action) {
      const trade = action.payload;
      const { symbol, price, timestamp } = trade;

      const prevTrade = state.trades[symbol];
      state.trades[symbol] = trade;

      // Flash animation signal
      if (prevTrade) {
        state.flashState[symbol] =
          price > prevTrade.price ? "gain" : price < prevTrade.price ? "loss" : null;
      }

      // Push into history ring-buffer
      if (!state.history[symbol]) state.history[symbol] = [];
      state.history[symbol] = [
        ...state.history[symbol].slice(-(MAX_HISTORY - 1)),
        { price, timestamp },
      ];

      // Update quote's current price so REST and WS stay in sync
      if (state.quotes[symbol]) {
        state.quotes[symbol].currentPrice = price;
      }
    },

    // Clear flash state after animation completes
    clearFlash(state, action) {
      const symbol = action.payload;
      state.flashState[symbol] = null;
    },

    setFeedStatus(state, action) {
      state.feedConnected = action.payload.connected;
      if (action.payload.fatal) state.feedFatal = true;
    },

    selectSymbol(state, action) {
      state.selectedSymbol = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // loadQuotes
    builder
      .addCase(loadQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadQuotes.fulfilled, (state, action) => {
        state.loading = false;
        for (const result of action.payload) {
          if (result.data) {
            state.quotes[result.symbol] = result.data;
          }
        }
      })
      .addCase(loadQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // loadSubscriptions
    builder.addCase(loadSubscriptions.fulfilled, (state, action) => {
      // Merge server subscriptions into watchlist
      const merged = new Set([...state.watchlist, ...action.payload]);
      state.watchlist = [...merged];
    });

    // addToWatchlist
    builder.addCase(addToWatchlist.fulfilled, (state, action) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload);
      }
    });

    // removeFromWatchlist
    builder.addCase(removeFromWatchlist.fulfilled, (state, action) => {
      state.watchlist = state.watchlist.filter((s) => s !== action.payload);
      if (state.selectedSymbol === action.payload) {
        state.selectedSymbol = state.watchlist[0] || null;
      }
    });
  },
});

export const {
  tradeTick,
  clearFlash,
  setFeedStatus,
  selectSymbol,
  clearError,
} = stocksSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectAllQuotes = (state) => state.stocks.quotes;
export const selectQuote = (symbol) => (state) => state.stocks.quotes[symbol];
export const selectTrade = (symbol) => (state) => state.stocks.trades[symbol];
export const selectHistory = (symbol) => (state) => state.stocks.history[symbol] || [];
export const selectWatchlist = (state) => state.stocks.watchlist;
export const selectSelectedSymbol = (state) => state.stocks.selectedSymbol;
export const selectFeedStatus = (state) => ({
  connected: state.stocks.feedConnected,
  fatal: state.stocks.feedFatal,
});
export const selectFlashState = (symbol) => (state) =>
  state.stocks.flashState[symbol];
export const selectLoading = (state) => state.stocks.loading;
export const selectError = (state) => state.stocks.error;

export default stocksSlice.reducer;
