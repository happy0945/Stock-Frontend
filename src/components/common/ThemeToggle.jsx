import { useTheme } from "@/context/ThemeContext";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.btn}
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
      aria-label="Toggle Theme"
    >
      <span className={styles.icon}>{theme === "dark" ? "☀️" : "🌙"}</span>
      <span>{theme === "dark" ? "LIGHT" : "DARK"}</span>
    </button>
  );
};

export default ThemeToggle;
