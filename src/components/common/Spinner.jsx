import styles from "./Spinner.module.css";

const Spinner = ({ size = "md", label = "Loading…" }) => (
  <div className={`${styles.wrapper} ${styles[size]}`} role="status" aria-label={label}>
    <div className={styles.ring} />
  </div>
);

export default Spinner;
