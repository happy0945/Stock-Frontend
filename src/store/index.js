/**
 * src/store/index.js
 * Redux store configuration.
 */

import { configureStore } from "@reduxjs/toolkit";
import stocksReducer from "./slices/stocksSlice";

const store = configureStore({
  reducer: {
    stocks: stocksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable timestamps in trades
        ignoredPaths: ["stocks.trades"],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
