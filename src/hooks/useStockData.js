/**
 * src/hooks/useStockData.js
 *
 * Loads initial REST quotes for the watchlist and refreshes them periodically.
 * After the first load the WebSocket keeps prices current, but this hook
 * ensures data is available even if the WS connection is temporarily down.
 */

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadQuotes, selectWatchlist } from "@/store/slices/stocksSlice";

const REFRESH_INTERVAL_MS = 30_000; // Refresh via REST every 30 s as fallback

const useStockData = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector(selectWatchlist);
  const timerRef = useRef(null);

  useEffect(() => {
    if (watchlist.length === 0) return;

    // Initial load
    dispatch(loadQuotes(watchlist));

    // Periodic fallback refresh
    timerRef.current = setInterval(() => {
      dispatch(loadQuotes(watchlist));
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(timerRef.current);
  }, [dispatch, watchlist]);
};

export default useStockData;
