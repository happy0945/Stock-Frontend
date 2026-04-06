/**
 * src/components/common/LiveBadge.jsx
 * Pulsing LIVE / OFFLINE indicator shown in the header.
 */

import { useSelector } from "react-redux";
import { selectFeedStatus } from "@/store/slices/stocksSlice";
import styles from "./LiveBadge.module.css";

const LiveBadge = () => {
  const { connected } = useSelector(selectFeedStatus);

  return (
    <div className={`${styles.badge} ${connected ? styles.live : styles.offline}`}>
      <span className={styles.dot} />
      <span className={styles.label}>{connected ? "LIVE" : "OFFLINE"}</span>
    </div>
  );
};

export default LiveBadge;
