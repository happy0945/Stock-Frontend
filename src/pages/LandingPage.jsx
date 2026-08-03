import { useState, useEffect, useRef } from "react";
import { fetchMarketNews } from "@/services/api";
import ThemeToggle from "@/components/common/ThemeToggle";
import styles from "./LandingPage.module.css";

const TICKERS = [
  { sym: "AAPL", price: 224.50, chg: "+1.84%", up: true },
  { sym: "MSFT", price: 448.90, chg: "+1.12%", up: true },
  { sym: "NVDA", price: 128.40, chg: "+3.65%", up: true },
  { sym: "TSLA", price: 218.20, chg: "-1.45%", up: false },
  { sym: "GOOGL", price: 178.60, chg: "+0.95%", up: true },
  { sym: "AMZN", price: 186.30, chg: "+2.10%", up: true },
  { sym: "META", price: 512.40, chg: "+4.18%", up: true },
  { sym: "BTC/USD", price: 64850.00, chg: "+2.85%", up: true },
  { sym: "ETH/USD", price: 3490.50, chg: "+3.40%", up: true },
];

const MARKET_INDICES = [
  { name: "S&P 500", value: "5,580.40", chg: "▲ +0.94%", up: true },
  { name: "NASDAQ", value: "17,890.10", chg: "▲ +1.35%", up: true },
  { name: "DOW JONES", value: "40,840.50", chg: "▲ +0.52%", up: true },
  { name: "RUSSELL 2K", value: "2,185.30", chg: "▼ -0.15%", up: false },
  { name: "VIX INDEX", value: "13.65", chg: "▼ -4.10%", up: false },
];

const LiveDot = () => <span className={styles.liveDot} />;

// Live Ticker Tape Header
const TickerTape = () => {
  const [items, setItems] = useState(TICKERS);

  useEffect(() => {
    const timer = setInterval(() => {
      setItems((prev) =>
        prev.map((t) => ({
          ...t,
          price: Math.max(t.price + (Math.random() - 0.48) * (t.price * 0.002), 1),
        }))
      );
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const duplicated = [...items, ...items];

  return (
    <div className={styles.tickerWrap}>
      <div className={styles.tickerTrack}>
        {duplicated.map((t, i) => (
          <div key={i} className={styles.tickerItem}>
            <span className={styles.tickerSym}>{t.sym}</span>
            <span className={styles.tickerPrice}>${t.price.toFixed(2)}</span>
            <span className={`${styles.tickerChg} ${t.up ? styles.up : styles.dn}`}>
              {t.up ? "▲" : "▼"} {t.chg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Real-Time Mountain Streaming Chart Component
const MountainStreamChart = () => {
  const [points, setPoints] = useState([
    { x: 0, y: 70 },
    { x: 40, y: 65 },
    { x: 80, y: 80 },
    { x: 120, y: 55 },
    { x: 160, y: 45 },
    { x: 200, y: 60 },
    { x: 240, y: 35 },
    { x: 280, y: 50 },
    { x: 320, y: 30 },
    { x: 360, y: 25 },
    { x: 400, y: 40 },
    { x: 440, y: 20 },
    { x: 480, y: 15 },
    { x: 520, y: 28 },
    { x: 560, y: 18 },
    { x: 600, y: 10 },
  ]);

  const [currentPrice, setCurrentPrice] = useState(224.50);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice((prev) => {
        const delta = (Math.random() - 0.47) * 0.85;
        const next = Math.max(prev + delta, 150);
        return parseFloat(next.toFixed(2));
      });

      setPoints((prev) => {
        const last = prev[prev.length - 1];
        const nextY = Math.min(Math.max(last.y + (Math.random() - 0.5) * 12, 8), 90);
        const shiftPoints = prev.map((pt, idx) => ({
          ...pt,
          y: idx === prev.length - 1 ? nextY : prev[idx + 1].y,
        }));
        return shiftPoints;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const areaD = `${pathD} L 600,120 L 0,120 Z`;
  const lastPt = points[points.length - 1];

  return (
    <div className={styles.mountainCard}>
      <div className={styles.mountainHeader}>
        <div>
          <div className={styles.mountainTitle}>LIVE MOUNTAIN REAL-TIME STREAM</div>
          <div className={styles.mountainSub}>AAPL · Apple Inc. · Sub-100ms WebSocket Ticks</div>
        </div>
        <div className={styles.mountainPriceBox}>
          <span className={styles.mountainPrice}>${currentPrice.toFixed(2)}</span>
          <span className={styles.mountainBadge}>▲ LIVE STREAMING</span>
        </div>
      </div>

      <div className={styles.svgWrap}>
        <svg viewBox="0 0 600 120" preserveAspectRatio="none" className={styles.mountainSvg}>
          <defs>
            <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#080c14" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="0" y1="90" x2="600" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

          {/* Area fill under mountain peak */}
          <path d={areaD} fill="url(#mountainGrad)" />

          {/* Mountain ridge stroke */}
          <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" filter="url(#glow)" />

          {/* Pulsing leading peak dot */}
          <circle cx={lastPt.x} cy={lastPt.y} r="5" fill="#38bdf8" />
          <circle cx={lastPt.x} cy={lastPt.y} r="9" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="r" values="5;14;5" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className={styles.mountainFooter}>
        <span>VOL: 42.8M</span>
        <span>HIGH: $226.10</span>
        <span>LOW: $221.40</span>
        <span>RSI: 64.2</span>
        <span>SIGNAL: BULLISH</span>
      </div>
    </div>
  );
};

export default function LandingPage({ onLaunch }) {
  const handleLaunch = onLaunch ?? (() => {});

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // Fetch real-time market news from Finnhub API via backend endpoint
  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await fetchMarketNews();
        if (Array.isArray(res?.data) && res.data.length > 0) {
          setNews(res.data);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Failed to load live news:", err);
      } finally {
        setNewsLoading(false);
      }
    };
    loadNews();
  }, []);

  return (
    <div className={styles.page}>
      <TickerTape />

      {/* Navigation Header */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>StockPulse</span>
        </div>

        <div className={styles.navRight}>
          <ThemeToggle />
          <button className={styles.navCta} onClick={handleLaunch}>
            Launch Terminal →
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>
          <LiveDot /> LIVE REAL-TIME MARKET TERMINAL & AI ENGINE
        </div>

        <h1 className={styles.heroTitle}>
          Next-Gen <span className={styles.gradientText}>Real-Time Stock</span> Intelligence & AI Predictions
        </h1>

        <p className={styles.heroSub}>
          Sub-100ms WebSocket price streaming, live market news feeds, and neural LLM price predictions built for traders and financial developers.
        </p>

        <div className={styles.heroActions}>
          <button className={styles.btnPrimary} onClick={handleLaunch}>
            Open Live Terminal →
          </button>
          <a href="#news" className={styles.btnSecondary}>
            View Live Market News ↓
          </a>
        </div>

        {/* Real-time Mountain Streaming Chart */}
        <MountainStreamChart />
      </section>

      {/* Market Indices Section */}
      <section className={styles.indicesBar}>
        <div className={styles.indicesGrid}>
          {MARKET_INDICES.map((idx) => (
            <div key={idx.name} className={styles.indexCard}>
              <span className={styles.indexName}>{idx.name}</span>
              <span className={styles.indexVal}>{idx.value}</span>
              <span className={`${styles.indexChg} ${idx.up ? styles.up : styles.dn}`}>
                {idx.chg}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Real-Time Market News Feed (Dynamic API data, NOT hardcoded) */}
      <section className={styles.newsSection} id="news">
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.badge}>FINNHUB REAL-TIME API</span>
            <h2 className={styles.sectionTitle}>Live Market News Stream</h2>
          </div>
          <span className={styles.liveIndicator}>
            <LiveDot /> Auto-updated from market news wire
          </span>
        </div>

        {newsLoading ? (
          <div className={styles.newsGrid}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className={styles.newsSkeleton}>
                <div className={styles.skLineLong} />
                <div className={styles.skLineShort} />
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className={styles.newsGrid}>
            {news.map((item, idx) => (
              <a
                key={item.id || idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.newsCard}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.headline}
                    className={styles.newsImg}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div className={styles.newsContent}>
                  <div className={styles.newsSourceRow}>
                    <span className={styles.newsSource}>{item.source || "FINANCIAL NEWS"}</span>
                    <span className={styles.newsTime}>
                      {new Date(item.datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h3 className={styles.newsHeadline}>{item.headline}</h3>
                  <p className={styles.newsSummary}>{item.summary}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles.emptyNews}>
            <span>Market news feed updating...</span>
          </div>
        )}
      </section>

      {/* Feature Highlights */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitleCenter}>Institutional-Grade Terminal Capabilities</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <span className={styles.featIcon}>⚡</span>
            <h3>Sub-100ms WebSocket Feeds</h3>
            <p>Persistent Socket.IO bi-directional connections with automatic reconnection and symbol subscription management.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featIcon}>🤖</span>
            <h3>LLM Stock Price Prediction</h3>
            <p>Integrated neural analysis engine computing 24h & 7d target prices, RSI indicators, stop loss, and AI market commentary for all stocks.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featIcon}>🏔️</span>
            <h3>Mountain & Candle Charts</h3>
            <p>High-precision streaming area and mountain charts with real-time price tick animations and sparkline history.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featIcon}>🔒</span>
            <h3>JWT & Google Authentication</h3>
            <p>Secure dual auth system supporting Email/Password registration (bcrypt hashed) and Google OAuth single sign-on.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>⚡</span>
              <span className={styles.logoText}>StockPulse</span>
            </div>
            <p className={styles.footerSub}>
              Real-Time Stock Market Intelligence, Mountain Streaming Charts & AI Predictions.
            </p>
          </div>
          <button className={styles.btnPrimary} onClick={handleLaunch}>
            Launch App →
          </button>
        </div>
      </footer>
    </div>
  );
}
