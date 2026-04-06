/**
 * src/pages/Dashboard.jsx
 * Main dashboard page — assembles all UI panels into the terminal layout.
 *
 * Layout:
 *  ┌─────────────────────────────────────────────────────┐
 *  │  Header                                             │
 *  ├─────────────────────────────────────────────────────┤
 *  │  TickerTape                                         │
 *  ├──────────────┬──────────────────────────────────────┤
 *  │              │  StockDetail                         │
 *  │  Watchlist   │  PriceChart                          │
 *  │  Panel       ├──────────────────────────────────────┤
 *  │              │  MarketGrid                          │
 *  │              ├──────────────┬───────────────────────┤
 *  │              │  (reserved)  │  TradeLog             │
 *  └──────────────┴──────────────┴───────────────────────┘
 */

import { useSelector } from "react-redux";
import Header from "@/components/dashboard/Header";
import TickerTape from "@/components/common/TickerTape";
import WatchlistPanel from "@/components/dashboard/WatchlistPanel";
import StockDetail from "@/components/stock/StockDetail";
import PriceChart from "@/components/chart/PriceChart";
import MarketGrid from "@/components/dashboard/MarketGrid";
import TradeLog from "@/components/stock/TradeLog";
import ErrorBanner from "@/components/common/ErrorBanner";
import Spinner from "@/components/common/Spinner";
import { selectLoading, selectError, selectFeedStatus, clearError } from "@/store/slices/stocksSlice";
import { useDispatch } from "react-redux";
import { loadQuotes, selectWatchlist } from "@/store/slices/stocksSlice";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const dispatch   = useDispatch();
  const loading    = useSelector(selectLoading);
  const error      = useSelector(selectError);
  const { fatal }  = useSelector(selectFeedStatus);
  const watchlist  = useSelector(selectWatchlist);

  return (
    <div className={styles.shell}>
      <Header />
      <TickerTape />

      {fatal && (
        <div className={styles.alertBar}>
          <ErrorBanner message="Real-time feed disconnected. Prices may be delayed." />
        </div>
      )}

      {error && (
        <div className={styles.alertBar}>
          <ErrorBanner
            message={error}
            onRetry={() => {
              dispatch(clearError());
              dispatch(loadQuotes(watchlist));
            }}
          />
        </div>
      )}

      <div className={styles.body}>
        {/* Left: watchlist sidebar */}
        <WatchlistPanel />

        {/* Right: main content area */}
        <main className={styles.main}>
          {loading && (
            <div className={styles.loadingOverlay}>
              <Spinner size="lg" />
            </div>
          )}

          {/* Top: detail + chart */}
          <div className={styles.topPane}>
            <div className={styles.detailWrap}>
              <StockDetail />
              <PriceChart />
            </div>
            <div className={styles.tradeLogWrap}>
              <TradeLog />
            </div>
          </div>

          {/* Bottom: market grid */}
          <div className={styles.bottomPane}>
            <MarketGrid />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
