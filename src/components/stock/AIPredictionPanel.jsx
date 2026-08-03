
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSelectedSymbol,
  selectAiPrediction,
  selectAiLoading,
  loadAiPrediction,
} from "@/store/slices/stocksSlice";
import { formatPrice } from "@/utils/formatters";
import styles from "./AIPredictionPanel.module.css";

const AIPredictionPanel = () => {
  const dispatch = useDispatch();
  const symbol = useSelector(selectSelectedSymbol);
  const prediction = useSelector(selectAiPrediction(symbol));
  const isLoading = useSelector(selectAiLoading(symbol));

  useEffect(() => {
    if (symbol && !prediction && !isLoading) {
      dispatch(loadAiPrediction(symbol));
    }
  }, [symbol, prediction, isLoading, dispatch]);

  const handleRefresh = () => {
    if (symbol) {
      dispatch(loadAiPrediction(symbol));
    }
  };

  if (!symbol) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.aiBadge}>AI LLM ENGINE</span>
          <h3 className={styles.title}>PRICE PREDICTION & ANALYSIS — {symbol}</h3>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? "ANALYZING..." : "REGENERATE AI ANALYSIS"}
        </button>
      </div>

      {isLoading && !prediction ? (
        <div className={styles.emptyState}>
          <span className={styles.label}>Running LLM Neural Predictive Engine...</span>
        </div>
      ) : prediction ? (
        <>
          <div className={styles.signalRow}>
            <div className={styles.recBox}>
              <span className={styles.label}>AI RECOMMENDATION</span>
              <span
                className={`${styles.recPill} ${
                  styles[prediction.recommendation.replace(" ", "_")] || ""
                }`}
              >
                {prediction.recommendation} ({prediction.signal})
              </span>
            </div>

            <div className={styles.confidenceBox}>
              <span className={styles.label}>CONFIDENCE SCORE</span>
              <span className={styles.confidenceVal}>{prediction.confidence}%</span>
              <div className={styles.meterTrack}>
                <div
                  className={styles.meterFill}
                  style={{ width: `${prediction.confidence}%` }}
                />
              </div>
            </div>
          </div>

          <div className={styles.targetsGrid}>
            <div className={styles.targetCard}>
              <span className={styles.label}>24H TARGET</span>
              <div className={styles.targetVal}>
                {formatPrice(prediction.predicted24hTarget)}
              </div>
              <div
                className={`${styles.targetChange} ${
                  prediction.predicted24hTarget >= prediction.currentPrice
                    ? styles.gain
                    : styles.loss
                }`}
              >
                {prediction.predicted24hTarget >= prediction.currentPrice ? "▲" : "▼"}{" "}
                {(
                  ((prediction.predicted24hTarget - prediction.currentPrice) /
                    prediction.currentPrice) *
                  100
                ).toFixed(2)}
                %
              </div>
            </div>

            <div className={styles.targetCard}>
              <span className={styles.label}>7D HORIZON TARGET</span>
              <div className={styles.targetVal}>
                {formatPrice(prediction.predicted7dTarget)}
              </div>
              <div
                className={`${styles.targetChange} ${
                  prediction.predicted7dTarget >= prediction.currentPrice
                    ? styles.gain
                    : styles.loss
                }`}
              >
                {prediction.predicted7dTarget >= prediction.currentPrice ? "▲" : "▼"}{" "}
                {(
                  ((prediction.predicted7dTarget - prediction.currentPrice) /
                    prediction.currentPrice) *
                  100
                ).toFixed(2)}
                %
              </div>
            </div>

            <div className={styles.targetCard}>
              <span className={styles.label}>SUGGESTED STOP LOSS</span>
              <div className={styles.targetVal}>{formatPrice(prediction.stopLoss)}</div>
              <div className={styles.label} style={{ marginTop: "2px" }}>
                RSI: {prediction.rsi}
              </div>
            </div>
          </div>

          <div className={styles.narrative}>
            <strong>LLM Technical Commentary:</strong> {prediction.aiAnalysis}
          </div>

          <div className={styles.drivers}>
            {prediction.keyDrivers?.map((driver, idx) => (
              <div key={idx} className={styles.driverItem}>
                <span className={styles.driverBullet}>◆</span>
                <span>{driver}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <button className={styles.refreshBtn} onClick={handleRefresh}>
            RUN AI PREDICTION FOR {symbol}
          </button>
        </div>
      )}
    </div>
  );
};

export default AIPredictionPanel;
