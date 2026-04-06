/**
 * src/components/common/TickerTape.jsx
 * Horizontally scrolling ticker tape showing live prices for all watchlist symbols.
 */

import { useSelector } from "react-redux";
import { selectWatchlist, selectQuote, selectTrade } from "@/store/slices/stocksSlice";
import { formatPrice, formatPercent, getDirection } from "@/utils/formatters";
import styles from "./TickerTape.module.css";

const TickerItem = ({ symbol }) => {
  const quote = useSelector(selectQuote(symbol));
  const trade = useSelector(selectTrade(symbol));

  const price = trade?.price ?? quote?.currentPrice;
  const pct   = quote?.percentChange;
  const dir   = getDirection(pct);

  return (
    <span className={styles.item}>
      <span className={styles.symbol}>{symbol}</span>
      <span className={`${styles.price} ${styles[dir]}`}>{formatPrice(price)}</span>
      <span className={`${styles.pct} ${styles[dir]}`}>{formatPercent(pct)}</span>
    </span>
  );
};

const TickerTape = () => {
  const watchlist = useSelector(selectWatchlist);
  // Duplicate list so the scroll appears seamless
  const doubled = [...watchlist, ...watchlist];

  return (
    <div className={styles.tape} aria-hidden="true">
      <div className={styles.track}>
        {doubled.map((sym, i) => (
          <TickerItem key={`${sym}-${i}`} symbol={sym} />
        ))}
      </div>
    </div>
  );
};

export default TickerTape;
