import Notebook from "./components/Notebook";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Notebook />
    </main>
  );
}
