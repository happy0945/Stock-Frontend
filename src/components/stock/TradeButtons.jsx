// src/components/stock/TradeButtons.jsx

import { getTradeUrl } from "@/utils/tradeLinks";
import styles from "./TradeButtons.module.css";

const TradeButtons = ({ symbol }) => {
  if (!symbol) return null;

  const handleTrade = () => {
    const url = getTradeUrl(symbol);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.buttons}>
      <button className={styles.buyBtn} onClick={handleTrade}>
        Buy {symbol}
      </button>
      <button className={styles.sellBtn} onClick={handleTrade}>
        Sell {symbol}
      </button>
    </div>
  );
};

export default TradeButtons;