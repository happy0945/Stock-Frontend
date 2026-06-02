/**
 * src/components/dashboard/MarketGrid.jsx
 * Card grid showing a compact overview of every symbol in the watchlist.
 */

import { useSelector, useDispatch } from "react-redux";
import {
  selectWatchlist,
  selectQuote,
  selectTrade,
  selectSelectedSymbol,
  selectSymbol,
} from "@/store/slices/stocksSlice";
import useFlash from "@/hooks/useFlash";
import { formatPrice, formatPercent, formatChange, formatCompact, getDirection } from "@/utils/formatters";
import styles from "./MarketGrid.module.css";

const MarketCard = ({ symbol }) => {
  const dispatch = useDispatch();
  const quote    = useSelector(selectQuote(symbol));
  const trade    = useSelector(selectTrade(symbol));
  const selected = useSelector(selectSelectedSymbol);
  const flash    = useFlash(symbol);

  const price  = trade?.price ?? quote?.currentPrice;
  const change = quote?.change;
  const pct    = quote?.percentChange;
  const dir    = getDirection(pct);
  const isSelected = selected === symbol;

  return (
    <div
      className={`
        ${styles.card}
        ${styles[dir]}
        ${isSelected ? styles.cardSelected : ""}
        ${flash === "gain" ? styles.flashGain : ""}
        ${flash === "loss" ? styles.flashLoss : ""}
      `}
      onClick={() => dispatch(selectSymbol(symbol))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && dispatch(selectSymbol(symbol))}
    >
      <div className={styles.cardTop}>
        <span className={styles.cardSymbol}>{symbol}</span>
        <span className={`${styles.cardDir} ${styles[dir]}`}>
          {dir === "gain" ? "▲" : dir === "loss" ? "▼" : "—"}
        </span>
      </div>

      <div className={styles.cardPrice}>{formatPrice(price)}</div>

      <div className={styles.cardBottom}>
        <span className={`${styles.cardPct} ${styles[dir]}`}>{formatPercent(pct)}</span>
        <span className={`${styles.cardChange} ${styles[dir]}`}>{formatChange(change)}</span>
      </div>

      {trade && (
        <div className={styles.cardVol}>VOL {formatCompact(trade.volume)}</div>
      )}
    </div>
  );
};

const MarketGrid = () => {
  const watchlist = useSelector(selectWatchlist);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>MARKET OVERVIEW</span>
      </div>
      <div className={styles.grid}>
        {watchlist.map((sym) => (
          <MarketCard key={sym} symbol={sym} />
        ))}
      </div>
    </section>
  );
};

export default MarketGrid;
