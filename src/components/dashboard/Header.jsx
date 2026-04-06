/**
 * src/components/dashboard/Header.jsx
 * Top navigation bar — branding, clock, live badge.
 */

import { useState, useEffect } from "react";
import LiveBadge from "@/components/common/LiveBadge";
import styles from "./Header.module.css";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = time.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const dateFmt = time.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <div className={styles.clock}>
      <span className={styles.time}>{fmt}</span>
      <span className={styles.date}>{dateFmt}</span>
    </div>
  );
};

const Header = () => (
  <header className={styles.header}>
    <div className={styles.left}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>▲</span>
        <span className={styles.logoText}>STOCKPULSE</span>
      </div>
      <span className={styles.tagline}>LIVE MARKET TERMINAL</span>
    </div>

    <div className={styles.right}>
      <Clock />
      <LiveBadge />
    </div>
  </header>
);

export default Header;
