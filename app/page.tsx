import Notebook from "./components/Notebook";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.diagonals} aria-hidden="true" />
      <Notebook />
    </main>
  );
}
