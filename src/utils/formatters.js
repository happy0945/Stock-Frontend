/**
 * src/utils/formatters.js
 * Display formatting utilities used across components.
 */

/**
 * Format a number as a USD price string.
 * @param {number|null|undefined} value
 * @param {number} decimals
 */
export const formatPrice = (value, decimals = 2) => {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a price change with sign and decimals.
 */
export const formatChange = (value, decimals = 2) => {
  if (value == null || isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}`;
};

/**
 * Format a percentage change with sign.
 */
export const formatPercent = (value, decimals = 2) => {
  if (value == null || isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Format a large number (volume, market cap) in K/M/B notation.
 */
export const formatCompact = (value) => {
  if (value == null || isNaN(value)) return "—";
  if (Math.abs(value) >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
};

/**
 * Format an ISO timestamp to "HH:MM:SS".
 */
export const formatTime = (isoString) => {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
};

/**
 * Format an ISO timestamp to "MMM DD, HH:MM".
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
};

/**
 * Determine if a change value is positive, negative, or neutral.
 * @returns {"gain"|"loss"|"neutral"}
 */
export const getDirection = (value) => {
  if (value == null) return "neutral";
  if (value > 0) return "gain";
  if (value < 0) return "loss";
  return "neutral";
};
