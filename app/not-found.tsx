import Link from "next/link";
import Layout from "./components/Layout";
import styles from "./page.module.css";

export default function NotFound() {
  return (
    <Layout>
      <section className={styles.writingSection}>
        <h2 className={styles.homeProjectTitle}>Page not found</h2>
        <p className={styles.paragraph}>This page may have moved. <Link href="/">Return home</Link> or explore the links above.</p>
      </section>
    </Layout>
  );
}
