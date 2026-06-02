import styles from "./ErrorBanner.module.css";

const ErrorBanner = ({ message, onRetry }) => (
  <div className={styles.banner} role="alert">
    <span className={styles.icon}>⚠</span>
    <span className={styles.message}>{message}</span>
    {onRetry && (
      <button className={styles.retry} onClick={onRetry}>
        RETRY
      </button>
    )}
  </div>
);

export default ErrorBanner;
