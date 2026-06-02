/**
 * src/components/chart/PriceChart.jsx
 * Area chart of the in-session price history for the selected symbol.
 * Powered by Recharts — responsive, animated, zero-config.
 */

import { useSelector } from "react-redux";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  selectSelectedSymbol,
  selectHistory,
  selectQuote,
} from "@/store/slices/stocksSlice";
import { formatPrice, formatTime, getDirection } from "@/utils/formatters";
import styles from "./PriceChart.module.css";

// Custom tooltip bubble
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipPrice}>{formatPrice(d.price)}</span>
      <span className={styles.tooltipTime}>{formatTime(d.timestamp)}</span>
    </div>
  );
};

const PriceChart = () => {
  const symbol  = useSelector(selectSelectedSymbol);
  const history = useSelector(selectHistory(symbol));
  const quote   = useSelector(selectQuote(symbol));

  const pct = quote?.percentChange;
  const dir = getDirection(pct);

  const strokeColor = dir === "gain"
    ? "var(--gain-bright)"
    : dir === "loss"
    ? "var(--loss-bright)"
    : "var(--blue-bright)";

  const gradientId = `gradient-${symbol}`;

  if (history.length < 2) {
    return (
      <div className={styles.empty}>
        <span>Waiting for live data stream…</span>
      </div>
    );
  }

  const prices = history.map((p) => p.price);
  const minY   = Math.min(...prices) * 0.9995;
  const maxY   = Math.max(...prices) * 1.0005;

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartHeader}>
        <span className={styles.chartTitle}>PRICE HISTORY — {symbol}</span>
        <span className={styles.chartPoints}>{history.length} ticks</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={history} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={strokeColor} stopOpacity={0.18} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-subtle)"
            vertical={false}
          />

          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            tick={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            domain={[minY, maxY]}
            tickFormatter={(v) => `$${v.toFixed(2)}`}
            tick={{ fontFamily: "var(--font-mono)", fontSize: 9, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={68}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 3, fill: strokeColor, stroke: "var(--bg-base)" }}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
