/**
 * src/pages/LandingPage.jsx
 * StockPulse marketing landing page — converted from HTML to React.
 *
 * Sections:
 *  TickerTape → Nav → Hero → MarketIndices → StatsBar →
 *  NewsSection → FeaturesSection → MarketTable →
 *  TestimonialsSection → FeedbackForm → Footer
 */

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./LandingPage.module.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TICKERS = [
  { sym: "AAPL",  price: 189.42,  chg: "+1.24%",  up: true  },
  { sym: "MSFT",  price: 425.81,  chg: "+0.87%",  up: true  },
  { sym: "NVDA",  price: 916.22,  chg: "-2.11%",  up: false },
  { sym: "TSLA",  price: 248.50,  chg: "-0.33%",  up: false },
  { sym: "GOOGL", price: 167.32,  chg: "+0.52%",  up: true  },
  { sym: "AMZN",  price: 182.94,  chg: "+1.76%",  up: true  },
  { sym: "META",  price: 492.78,  chg: "+6.09%",  up: true  },
  { sym: "BRK.B", price: 406.11,  chg: "-0.08%",  up: false },
  { sym: "JPM",   price: 199.30,  chg: "+0.66%",  up: true  },
  { sym: "V",     price: 282.14,  chg: "+0.41%",  up: true  },
  { sym: "UNH",   price: 528.20,  chg: "-1.18%",  up: false },
  { sym: "XOM",   price: 112.88,  chg: "+0.92%",  up: true  },
  { sym: "LLY",   price: 748.00,  chg: "+2.14%",  up: true  },
  { sym: "AVGO",  price: 1329.50, chg: "+1.84%",  up: true  },
];

const MARKET_INDICES = [
  { name: "S&P 500",    value: "5,421.03", chg: "▲ +0.84%", up: true,  points: "0,28 12,24 25,20 38,22 50,16 62,18 75,12 88,10 100,6" },
  { name: "NASDAQ",     value: "17,082.4", chg: "▲ +1.12%", up: true,  points: "0,30 12,26 25,18 38,22 50,14 62,16 75,10 88,8 100,4"  },
  { name: "DOW JONES",  value: "39,760.1", chg: "▲ +0.61%", up: true,  points: "0,26 12,22 25,24 38,18 50,20 62,16 75,14 88,12 100,8" },
  { name: "RUSSELL 2K", value: "2,114.8",  chg: "▼ -0.23%", up: false, points: "0,8 12,12 25,10 38,14 50,12 62,16 75,18 88,20 100,24" },
  { name: "VIX",        value: "14.28",    chg: "▼ -3.21%", up: false, points: "0,6 12,10 25,8 38,14 50,12 62,16 75,20 88,22 100,26"  },
];

const FEATURES = [
  { icon: "⚡", color: "green", accent: "c1", title: "Real-Time WebSocket Feeds",    desc: "Bi-directional Socket.IO streaming delivers live trade data, price ticks, and volume updates with sub-100ms latency. The backend manages subscriptions and broadcasts only relevant events." },
  { icon: "📊", color: "blue",  accent: "c2", title: "Interactive Price Charts",      desc: "Recharts-powered intraday and historical price charts with candlestick, area, and line views. Flash animations highlight price movements as they happen." },
  { icon: "🔔", color: "gold",  accent: "c3", title: "Watchlist & Alerts",            desc: "Maintain a personalized watchlist with Redux state persistence. Add and remove symbols, track positions, and receive toast notifications on significant price movements." },
  { icon: "🏗️", color: "purple",accent: "c4", title: "REST API Layer",               desc: "Full Express.js REST API with rate limiting, CORS, and Helmet security headers. Endpoints for quotes, batch data, subscriptions, and health monitoring." },
  { icon: "📋", color: "red",   accent: "c5", title: "Trade Log & History",           desc: "Real-time trade log showing the latest executions for any symbol, including price, volume, exchange, and timestamp. Auto-scrolling with configurable depth." },
  { icon: "🔌", color: "green", accent: "c6", title: "Finnhub Integration",           desc: "Powered by Finnhub's institutional-grade data feed. Access quotes, trades, earnings, news, and fundamentals through a unified backend service layer with caching." },
];

const NEWS = [
  { featured: true,  category: "Earnings", catClass: "earnings", title: "Meta Platforms Surges 6% After Record Q1 Ad Revenue; Zuckerberg Unveils AI Assistant Expansion", summary: "Meta reported $36.5B in quarterly revenue, beating estimates by $2.1B. The company announced aggressive AI infrastructure spending while raising FY guidance, sending the stock to all-time highs.", time: "2 hr ago", source: "Bloomberg", impact: "▲ META", impactClass: "up" },
  { featured: false, category: "Macro",    catClass: "macro",    title: "Fed Holds Rates Steady; Powell Signals Two Cuts Remain on Table for 2024", summary: "The Federal Reserve maintained the federal funds rate at 5.25–5.50% for the sixth consecutive meeting, with the dot plot revised to indicate fewer cuts.", time: "4 hr ago", source: "Reuters", impact: "▲ TLT", impactClass: "up" },
  { featured: false, category: "Analysis", catClass: "analysis", title: "Reddit's First Earnings as Public Company Beat Expectations; DAU Up 37% YoY", summary: "RDDT reported strong user growth and ad revenue metrics in its maiden public earnings report.", time: "6 hr ago", source: "WSJ", impact: "▲ RDDT", impactClass: "up" },
  { featured: false, category: "Risk",     catClass: "risk",     title: "China Export Controls on Rare Earth Materials Jolt Semiconductor Stocks", summary: "New Beijing restrictions on gallium and germanium exports sparked sell-offs across the semiconductor supply chain.", time: "8 hr ago", source: "FT",  impact: "▼ SOX -2.3%", impactClass: "dn" },
];

const MOVERS = [
  { sym: "SMCI", name: "Super Micro Computer", price: "$874.21",   chg: "+$82.4",  pct: "+10.40%", vol: "9.2M",  cap: "$45.8B",  bars: [12,16,8,18,22,26,28].map((h,i) => ({ h, up: i !== 2 })) },
  { sym: "ARM",  name: "Arm Holdings plc",     price: "$138.50",   chg: "+$11.2",  pct: "+8.81%",  vol: "14.1M", cap: "$143.2B", bars: [10,8,14,20,18,24,28].map((h,i) => ({ h, up: i !== 1 })) },
  { sym: "COIN", name: "Coinbase Global",       price: "$248.33",   chg: "+$17.6",  pct: "+7.63%",  vol: "6.8M",  cap: "$59.4B",  bars: [18,14,20,10,16,22,28].map((h,i) => ({ h, up: i !== 3 })) },
  { sym: "MSTR", name: "MicroStrategy Inc.",    price: "$1,482.00", chg: "+$94.1",  pct: "+6.77%",  vol: "1.8M",  cap: "$28.1B",  bars: [8,12,16,12,20,24,28].map((h,i) => ({ h, up: i !== 3 })) },
  { sym: "META", name: "Meta Platforms",        price: "$492.78",   chg: "+$28.3",  pct: "+6.09%",  vol: "22.4M", cap: "$1.25T",  bars: [14,18,12,20,22,26,28].map((h,i) => ({ h, up: i !== 2 })) },
];

const TESTIMONIALS = [
  { stars: 5, quote: "The WebSocket latency is exceptional. I'm seeing price updates 2–3x faster than competing platforms I've tested. The Redux state management is also surprisingly clean for a project of this scope.", name: "Rohan Kapoor",    title: "Quantitative Analyst · Citadel",              initials: "RK", avatarClass: "avatarA" },
  { stars: 5, quote: "As someone who built similar tools internally, I'm impressed by how StockPulse packages the Finnhub integration. The rate limiting and error handling are production-ready out of the box.",     name: "Sarah Lin",       title: "Senior Software Engineer · Two Sigma",        initials: "SL", avatarClass: "avatarB" },
  { stars: 4, quote: "Clean dark UI that doesn't strain the eyes during long trading sessions. The ticker tape and live badge are nice touches. Would love to see options chain data and level 2 quotes next.",         name: "Alex Martinez",   title: "Retail Trader & Developer",                   initials: "AM", avatarClass: "avatarC" },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const LiveDot = () => <span className={styles.liveDot} />;

// Ticker tape — duplicated for seamless loop
const TickerTape = () => {
  const [tickers, setTickers] = useState(TICKERS.map(t => ({ ...t })));

  useEffect(() => {
    const id = setInterval(() => {
      setTickers(prev => prev.map(t => ({
        ...t,
        price: Math.max(t.price + (Math.random() - 0.48) * 0.4, 1),
      })));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const items = [...tickers, ...tickers];
  return (
    <div className={styles.tickerWrap}>
      <div className={styles.tickerTrack}>
        {items.map((t, i) => (
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

// Nav
const Nav = ({ onLaunch }) => (
  <nav className={styles.nav}>
    <div className={styles.logo}>
      <div className={styles.logoIcon}>📈</div>
      StockPulse
    </div>
    <ul className={styles.navLinks}>
      {["Markets", "News", "Features", "Feedback", "Docs"].map(label => (
        <li key={label}>
          <a href={`#${label.toLowerCase()}`}>{label}</a>
        </li>
      ))}
    </ul>
    <button className={styles.navCta} onClick={onLaunch}>Launch App →</button>
  </nav>
);

// Hero
const Hero = ({ onLaunch }) => {
  const [heroPrice, setHeroPrice] = useState(189.42);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroPrice(p => Math.max(p + (Math.random() - 0.48) * 0.15, 1));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />
      <div className={styles.heroGrid} />

      <div className={styles.heroTag}>
        <LiveDot /> Live Market Data · Sub-100ms Latency
      </div>

      <h1 className={styles.heroH1}>
        Trade smarter with{" "}
        <span className={styles.accentGreen}>real-time</span> market{" "}
        <span className={styles.accentBlue}>intelligence</span>
      </h1>

      <p className={styles.heroSub}>
        StockPulse delivers institutional-grade market data via WebSocket streams, REST APIs,
        and a live dashboard — all built for speed, precision, and developer extensibility.
      </p>

      <div className={styles.heroActions}>
        <button className={styles.btnPrimary} id="launch" onClick={onLaunch}>Open Dashboard →</button>
        <button className={styles.btnSecondary}>View API Docs</button>
      </div>

      {/* Mini dashboard preview */}
      <div className={styles.heroPreview}>
        <div className={styles.previewFrame}>
          <div className={styles.previewTopbar}>
            <span className={styles.previewDot} style={{ background: "#ff5f56" }} />
            <span className={styles.previewDot} style={{ background: "#ffbd2e" }} />
            <span className={styles.previewDot} style={{ background: "#27c93f" }} />
            <span className={styles.previewUrl}>localhost:5173 — StockPulse Dashboard</span>
          </div>
          <div className={styles.previewBody}>
            <div className={styles.previewSidebar}>
              <div className={styles.previewSidebarLabel}>Watchlist</div>
              {[
                { sym: "AAPL",  name: "Apple Inc.",      price: "$189.42", chg: "+1.24%", up: true,  active: true  },
                { sym: "MSFT",  name: "Microsoft Corp.", price: "$425.81", chg: "+0.87%", up: true,  active: false },
                { sym: "NVDA",  name: "NVIDIA Corp.",    price: "$916.22", chg: "-2.11%", up: false, active: false },
                { sym: "TSLA",  name: "Tesla Inc.",      price: "$248.50", chg: "-0.33%", up: false, active: false },
                { sym: "GOOGL", name: "Alphabet Inc.",   price: "$167.32", chg: "+0.52%", up: true,  active: false },
              ].map(s => (
                <div key={s.sym} className={`${styles.previewStockRow} ${s.active ? styles.previewActive : ""}`}>
                  <div>
                    <div className={styles.psrSym}>{s.sym}</div>
                    <div className={styles.psrName}>{s.name}</div>
                  </div>
                  <div>
                    <div className={styles.psrPrice}>{s.sym === "AAPL" ? `$${heroPrice.toFixed(2)}` : s.price}</div>
                    <div className={`${styles.psrChg} ${s.up ? styles.up : styles.dn}`}>{s.chg}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.previewMain}>
              <div className={styles.previewStockHeader}>
                <div>
                  <div className={styles.previewStockName}>AAPL · Apple Inc.</div>
                  <span className={styles.previewStockBadge}>▲ +1.24% today</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className={`${styles.previewStockPrice} ${styles.up}`}>${heroPrice.toFixed(2)}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>Live · NYSE</div>
                </div>
              </div>
              <div className={styles.sparklineContainer}>
                <svg viewBox="0 0 600 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="lgHero" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00d46e" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00d46e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,90 C30,88 60,72 90,68 C120,64 150,82 180,76 C210,70 240,55 270,50 C300,45 330,58 360,52 C390,46 420,30 450,28 C480,26 510,40 540,35 C560,32 580,20 600,18 L600,120 L0,120Z" fill="url(#lgHero)" />
                  <path d="M0,90 C30,88 60,72 90,68 C120,64 150,82 180,76 C210,70 240,55 270,50 C300,45 330,58 360,52 C390,46 420,30 450,28 C480,26 510,40 540,35 C560,32 580,20 600,18" fill="none" stroke="#00d46e" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Market Indices bar
const MarketIndices = () => (
  <div className={styles.marketsOverview} id="markets">
    <div className={styles.marketsOverviewInner}>
      {MARKET_INDICES.map(idx => (
        <div key={idx.name} className={styles.marketIndexCard}>
          <div className={styles.micName}>{idx.name}</div>
          <div className={styles.micValue}>{idx.value}</div>
          <div className={`${styles.micChg} ${idx.up ? styles.up : styles.dn}`}>{idx.chg}</div>
          <div className={styles.micMini}>
            <svg viewBox="0 0 100 36" preserveAspectRatio="none">
              <polyline points={idx.points} fill="none" stroke={idx.up ? "#00d46e" : "#ff4f6a"} strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Stats bar
const StatsBar = () => (
  <div className={styles.statsBar}>
    {[
      { value: "< 100ms", label: "WebSocket Latency",    cls: "green" },
      { value: "14+",     label: "Symbols Tracked Live", cls: "blue"  },
      { value: "99.9%",   label: "API Uptime SLA",       cls: "gold"  },
      { value: "Open",    label: "Source on GitHub",     cls: ""      },
    ].map(s => (
      <div key={s.label} className={styles.statCell}>
        <div className={`${styles.statValue} ${s.cls ? styles[s.cls] : ""}`}>{s.value}</div>
        <div className={styles.statLabel}>{s.label}</div>
      </div>
    ))}
  </div>
);

// News
const NewsSection = () => (
  <div className={styles.newsSection} id="news">
    <div className={styles.newsInner}>
      <div className={styles.newsHeader}>
        <div>
          <div className={styles.sectionLabel}>Live Market Intelligence</div>
          <div className={styles.sectionTitle} style={{ fontSize: "clamp(24px,3vw,36px)" }}>
            Market-moving news, curated
          </div>
        </div>
        <button className={styles.btnSecondary} style={{ alignSelf: "flex-end" }}>View All News →</button>
      </div>
      <div className={styles.newsGrid}>
        {NEWS.map((n, i) => (
          <div key={i} className={`${styles.newsCard} ${n.featured ? styles.newsFeatured : ""}`}>
            <div className={`${styles.newsCategory} ${styles[n.catClass]}`}>● {n.category}</div>
            <div className={`${styles.newsTitle} ${n.featured ? styles.newsFeaturedTitle : ""}`}>{n.title}</div>
            <div className={styles.newsSummary}>{n.summary}</div>
            <div className={styles.newsMeta}>
              <span className={styles.newsTime}>{n.time}</span>
              <span className={styles.newsSource}>{n.source}</span>
              <span className={`${styles.newsImpact} ${styles[n.impactClass]}`}>{n.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Features
const FeaturesSection = () => (
  <section className={styles.section} id="features">
    <div className={styles.sectionLabel}>Platform Capabilities</div>
    <div className={styles.sectionTitle}>Everything you need for serious market analysis</div>
    <p className={styles.sectionSub}>
      Built on a Node.js + Socket.IO backend with Finnhub integration, StockPulse combines real-time streaming
      with a clean, extensible React dashboard.
    </p>
    <div className={styles.featuresGrid}>
      {FEATURES.map(f => (
        <div key={f.title} className={`${styles.featureCard} ${styles[f.accent]}`}>
          <div className={`${styles.featureIcon} ${styles[f.color]}`}>{f.icon}</div>
          <div className={styles.featureTitle}>{f.title}</div>
          <div className={styles.featureDesc}>{f.desc}</div>
        </div>
      ))}
    </div>
  </section>
);

// Market Table
const MarketTable = () => {
  const [activeTab, setActiveTab] = useState("Gainers");
  return (
    <div className={styles.marketSection}>
      <div className={styles.sectionLabel}>Market Overview</div>
      <div className={styles.sectionTitle} style={{ fontSize: "28px", maxWidth: "100%", marginBottom: "24px" }}>
        Top Movers & Market Activity
      </div>
      <div className={styles.marketTabs}>
        {["Gainers", "Losers", "Volume", "Sector"].map(tab => (
          <button
            key={tab}
            className={`${styles.marketTab} ${activeTab === tab ? styles.marketTabActive : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <table className={styles.marketTable}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Symbol</th>
            <th>Price</th>
            <th>Change</th>
            <th>% Change</th>
            <th>Volume</th>
            <th>Market Cap</th>
            <th>7-Day</th>
          </tr>
        </thead>
        <tbody>
          {MOVERS.map(m => (
            <tr key={m.sym}>
              <td><div className={styles.symBold}>{m.sym}</div><div className={styles.symName}>{m.name}</div></td>
              <td>{m.price}</td>
              <td className={`${styles.chg} ${styles.up}`}>{m.chg}</td>
              <td className={`${styles.chg} ${styles.up}`}>{m.pct}</td>
              <td>{m.vol}</td>
              <td>{m.cap}</td>
              <td>
                <div className={styles.sparkbars}>
                  {m.bars.map((b, i) => (
                    <div key={i} className={`${styles.sparkbar} ${b.up ? styles.sparkUp : styles.sparkDn}`} style={{ height: `${b.h}px` }} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Testimonials
const TestimonialsSection = () => (
  <div className={styles.feedbackSection} id="feedback">
    <div className={styles.feedbackInner}>
      <div className={styles.sectionLabel}>User Feedback</div>
      <div className={styles.sectionTitle}>Trusted by traders &amp; developers</div>
      <p className={styles.sectionSub}>What professional traders and developers are saying about StockPulse.</p>
      <div className={styles.feedbackGrid}>
        {TESTIMONIALS.map(t => (
          <div key={t.name} className={styles.feedbackCard}>
            <div className={styles.stars}>{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</div>
            <div className={styles.feedbackQuote}>"{t.quote}"</div>
            <div className={styles.feedbackAuthor}>
              <div className={`${styles.authorAvatar} ${styles[t.avatarClass]}`}>{t.initials}</div>
              <div>
                <div className={styles.authorName}>{t.name}</div>
                <div className={styles.authorTitle}>{t.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Feedback Form
const FeedbackForm = () => {
  const [form, setForm] = useState({ name: "", email: "", type: "Feature Request", message: "" });
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | sending | done

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1200);
  };

  const btnLabel = status === "sending" ? "Sending..." : status === "done" ? "✓ Feedback Received!" : "Submit Feedback →";

  return (
    <div className={styles.feedbackFormSection}>
      <div className={styles.feedbackFormGrid}>
        <div>
          <div className={styles.sectionLabel}>Share Your Experience</div>
          <div className={styles.sectionTitle}>Help us build better tools</div>
          <p className={styles.sectionSub}>
            Your feedback directly influences our roadmap. Tell us what you love, what's missing,
            and what you'd like to see next in StockPulse.
          </p>
          <div className={styles.formMeta}>
            {[
              { icon: "🎯", bg: "var(--gain-dim)",            text: "Feature requests are triaged weekly" },
              { icon: "🐛", bg: "var(--accent-dim)",          text: "Bug reports are investigated within 24hrs" },
              { icon: "💡", bg: "rgba(245,200,66,0.1)",        text: "Ideas are posted to our public roadmap" },
            ].map(item => (
              <div key={item.text} className={styles.formMetaRow}>
                <div className={styles.formMetaIcon} style={{ background: item.bg }}>{item.icon}</div>
                <div className={styles.formMetaText}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formBox}>
          <div className={styles.formTitle}>Send Feedback</div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>Your Name</label>
            <input className={styles.formInput} name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Email Address</label>
            <input className={styles.formInput} type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Feedback Type</label>
            <select className={styles.formSelect} name="type" value={form.type} onChange={handleChange}>
              {["Feature Request", "Bug Report", "Performance Issue", "UI/UX Suggestion", "General Feedback", "API Question"].map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Rating</label>
            <div className={styles.ratingRow}>
              {[1,2,3,4,5].map(n => (
                <span
                  key={n}
                  className={`${styles.ratingStar} ${n <= rating ? styles.ratingActive : ""}`}
                  onClick={() => setRating(n)}
                >★</span>
              ))}
            </div>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Your Message</label>
            <textarea
              className={styles.formTextarea}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your experience, what you'd like to see improved, or any bugs you've encountered..."
            />
          </div>
          <button
            className={styles.formSubmit}
            onClick={handleSubmit}
            disabled={status !== "idle"}
            style={status === "done" ? { background: "var(--gain)" } : {}}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer
const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <div className={styles.footerBrand}>
        <div className={styles.logo}><div className={styles.logoIcon}>📈</div> StockPulse</div>
        <p className={styles.footerDesc}>Institutional-grade market data infrastructure for developers and professional traders. Built with Node.js, React, and Socket.IO.</p>
        <div className={styles.footerStatus}><LiveDot /> All systems operational</div>
      </div>
      {[
        { label: "Product",    links: ["Dashboard","Live Markets","Price Charts","Trade Log","Watchlists"] },
        { label: "Developers", links: ["REST API Docs","WebSocket API","Finnhub Setup","GitHub Repo","Changelog"] },
        { label: "Company",    links: ["About","Blog","Privacy Policy","Terms of Service","Contact"] },
      ].map(col => (
        <div key={col.label}>
          <div className={styles.footerColLabel}>{col.label}</div>
          <ul className={styles.footerLinks}>
            {col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}
          </ul>
        </div>
      ))}
    </div>
    <div className={styles.footerBottom}>
      <div className={styles.footerCopy}>© 2025 StockPulse. All rights reserved. Market data provided by Finnhub.io.</div>
      <div className={styles.footerBadges}>
        {["Node.js v20","React 18","Socket.IO 4","Finnhub API"].map(b => (
          <span key={b} className={styles.footerBadge}>{b}</span>
        ))}
      </div>
    </div>
  </footer>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const LandingPage = ({ onLaunch }) => {
  const handleLaunch = onLaunch ?? (() => {});

  return (
    <div className={styles.page}>
      <TickerTape />
      <Nav onLaunch={handleLaunch} />
      <Hero onLaunch={handleLaunch} />
      <MarketIndices />
      <StatsBar />
      <NewsSection />
      <FeaturesSection />
      <MarketTable />
      <TestimonialsSection />
      <FeedbackForm />
      <Footer />
    </div>
  );
};

export default LandingPage;
