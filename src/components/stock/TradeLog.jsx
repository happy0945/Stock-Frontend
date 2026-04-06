/**
 * src/components/stock/TradeLog.jsx
 * Real-time scrolling log of the last N trade ticks for the selected symbol.
 */

import { useSelector } from "react-redux";
import {
  selectSelectedSymbol,
  selectHistory,
} from "@/store/slices/stocksSlice";
import { formatPrice, formatTime, formatCompact, getDirection } from "@/utils/formatters";
import styles from "./TradeLog.module.css";

const TradeLog = () => {
  const symbol  = useSelector(selectSelectedSymbol);
  const history = useSelector(selectHistory(symbol));

  // Show last 20 ticks, most recent first
  const ticks = [...history].reverse().slice(0, 20);

  return (
    <div className={styles.log}>
      <div className={styles.header}>
        <span className={styles.title}>TRADE LOG</span>
        <span className={styles.count}>{history.length} events</span>
      </div>

      {ticks.length === 0 ? (
        <div className={styles.empty}>Waiting for trades…</div>
      ) : (
        <div className={styles.list}>
          {ticks.map((tick, i) => {
            const prev = ticks[i + 1];
            const dir  = prev ? getDirection(tick.price - prev.price) : "neutral";
            return (
              <div key={`${tick.timestamp}-${i}`} className={`${styles.row} animate-fade-in-up`}>
                <span className={styles.rowTime}>{formatTime(tick.timestamp)}</span>
                <span className={`${styles.rowPrice} ${styles[dir]}`}>
                  {formatPrice(tick.price)}
                </span>
                {tick.volume != null && (
                  <span className={styles.rowVol}>{formatCompact(tick.volume)}</span>
                )}
                <span className={`${styles.rowArrow} ${styles[dir]}`}>
                  {dir === "gain" ? "▲" : dir === "loss" ? "▼" : "·"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TradeLog;
