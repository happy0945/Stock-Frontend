/**
 * src/components/stock/StockDetail.jsx
 * Hero panel showing full detail for the currently selected symbol.
 */

import { useSelector } from "react-redux";
import {
  selectSelectedSymbol,
  selectQuote,
  selectTrade,
} from "@/store/slices/stocksSlice";
import useFlash from "@/hooks/useFlash";
import {
  formatPrice,
  formatChange,
  formatPercent,
  formatCompact,
  formatTime,
  getDirection,
} from "@/utils/formatters";
import styles from "./StockDetail.module.css";

const StatBox = ({ label, value, dir }) => (
  <div className={styles.statBox}>
    <span className={styles.statLabel}>{label}</span>
    <span className={`${styles.statValue} ${dir ? styles[dir] : ""}`}>{value}</span>
  </div>
);

const StockDetail = () => {
  const symbol  = useSelector(selectSelectedSymbol);
  const quote   = useSelector(selectQuote(symbol));
  const trade   = useSelector(selectTrade(symbol));
  const flash   = useFlash(symbol);

  if (!symbol) return (
    <div className={styles.empty}>
      <span>Select a symbol from the watchlist</span>
    </div>
  );

  const price   = trade?.price ?? quote?.currentPrice;
  const change  = quote?.change;
  const pct     = quote?.percentChange;
  const dir     = getDirection(pct);

  return (
    <div className={`${styles.detail} ${flash === "gain" ? styles.flashGain : flash === "loss" ? styles.flashLoss : ""}`}>
      {/* ── Symbol + Price ─────────────────────────────────────────── */}
      <div className={styles.top}>
        <div className={styles.symbolBlock}>
          <h1 className={styles.symbol}>{symbol}</h1>
          <span className={styles.marketLabel}>NASDAQ · USD</span>
        </div>

        <div className={styles.priceBlock}>
          <span className={`${styles.price} ${styles[dir]}`}>
            {formatPrice(price)}
          </span>
          <div className={styles.changeRow}>
            <span className={`${styles.change} ${styles[dir]}`}>
              {dir === "gain" ? "▲" : dir === "loss" ? "▼" : ""}{" "}
              {formatChange(change)} ({formatPercent(pct)})
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats grid ─────────────────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatBox label="OPEN"   value={formatPrice(quote?.openPrice)} />
        <StatBox label="PREV CLOSE" value={formatPrice(quote?.previousClose)} />
        <StatBox label="DAY HIGH"  value={formatPrice(quote?.highPrice)} dir="gain" />
        <StatBox label="DAY LOW"   value={formatPrice(quote?.lowPrice)}  dir="loss" />
        <StatBox label="CHANGE"    value={formatChange(change)}          dir={dir} />
        <StatBox label="CHG %"     value={formatPercent(pct)}            dir={dir} />
        {trade && <>
          <StatBox label="LAST TRADE"  value={formatPrice(trade.price)} />
          <StatBox label="VOLUME"      value={formatCompact(trade.volume)} />
          <StatBox label="UPDATED"     value={formatTime(trade.timestamp)} />
        </>}
      </div>

      {/* ── Live trade badge ────────────────────────────────────────── */}
      {trade && (
        <div className={styles.tradePill}>
          <span className={styles.tradeDot} />
          LIVE TRADE — {formatPrice(trade.price)} · VOL {formatCompact(trade.volume)} · {formatTime(trade.timestamp)}
        </div>
      )}
    </div>
  );
};

export default StockDetail;
