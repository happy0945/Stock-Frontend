/**
 * src/components/dashboard/WatchlistPanel.jsx
 * Left sidebar — symbol list with live prices, P/L, and add/remove controls.
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWatchlist,
  selectQuote,
  selectTrade,
  selectSelectedSymbol,
  selectSymbol,
  addToWatchlist,
  removeFromWatchlist,
} from "@/store/slices/stocksSlice";
import useFlash from "@/hooks/useFlash";
import { formatPrice, formatPercent, formatChange, getDirection } from "@/utils/formatters";
import styles from "./WatchlistPanel.module.css";

// Single row
const WatchlistRow = ({ symbol, isSelected, onSelect }) => {
  const quote = useSelector(selectQuote(symbol));
  const trade = useSelector(selectTrade(symbol));
  const dispatch = useDispatch();
  const flash = useFlash(symbol);

  const price  = trade?.price ?? quote?.currentPrice;
  const change = quote?.change;
  const pct    = quote?.percentChange;
  const dir    = getDirection(pct);

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch(removeFromWatchlist(symbol));
  };

  return (
    <div
      className={`
        ${styles.row}
        ${isSelected ? styles.selected : ""}
        ${flash === "gain" ? styles.flashGain : ""}
        ${flash === "loss" ? styles.flashLoss : ""}
      `}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <div className={styles.rowLeft}>
        <span className={styles.rowSymbol}>{symbol}</span>
        <span className={`${styles.rowDir} ${styles[dir]}`}>
          {dir === "gain" ? "▲" : dir === "loss" ? "▼" : "—"}
        </span>
      </div>
      <div className={styles.rowRight}>
        <span className={styles.rowPrice}>{formatPrice(price)}</span>
        <span className={`${styles.rowChange} ${styles[dir]}`}>
          {formatPercent(pct)}
        </span>
        <span className={`${styles.rowAbs} ${styles[dir]}`}>
          {formatChange(change)}
        </span>
      </div>
      <button
        className={styles.removeBtn}
        onClick={handleRemove}
        title={`Remove ${symbol}`}
        aria-label={`Remove ${symbol}`}
      >
        ×
      </button>
    </div>
  );
};

// Add symbol form
const AddSymbolForm = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const watchlist = useSelector(selectWatchlist);

  const handleAdd = () => {
    const sym = input.trim().toUpperCase();
    if (!sym) return;
    if (!/^[A-Z]{1,10}$/.test(sym)) {
      setError("Invalid symbol");
      return;
    }
    if (watchlist.includes(sym)) {
      setError("Already in watchlist");
      return;
    }
    dispatch(addToWatchlist(sym));
    setInput("");
    setError("");
  };

  return (
    <div className={styles.addForm}>
      <div className={styles.addInputRow}>
        <input
          className={`${styles.addInput} ${error ? styles.addInputError : ""}`}
          value={input}
          onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="ADD SYMBOL…"
          maxLength={10}
          spellCheck={false}
        />
        <button className={styles.addBtn} onClick={handleAdd}>+</button>
      </div>
      {error && <p className={styles.addError}>{error}</p>}
    </div>
  );
};

const WatchlistPanel = () => {
  const watchlist      = useSelector(selectWatchlist);
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const dispatch       = useDispatch();

  return (
    <aside className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>WATCHLIST</span>
        <span className={styles.panelCount}>{watchlist.length}</span>
      </div>

      <div className={styles.list}>
        {watchlist.map((sym) => (
          <WatchlistRow
            key={sym}
            symbol={sym}
            isSelected={sym === selectedSymbol}
            onSelect={() => dispatch(selectSymbol(sym))}
          />
        ))}
      </div>

      <AddSymbolForm />
    </aside>
  );
};

export default WatchlistPanel;
