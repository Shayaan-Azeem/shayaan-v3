import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.stack}>
        <div className={styles.pages} aria-hidden="true" />
        <section className={styles.notebook} aria-label="Shayaan Azeem">
          <div className={styles.staples} aria-hidden="true">
            <span className={styles.staple} />
            <span className={styles.staple} />
          </div>
          <nav className={styles.nav} aria-label="Primary">
            <Link href="/writing">Writing</Link>
            <Link href="/about">About Me</Link>
            <Link href="/experience">Experience</Link>
          </nav>
          <div className={styles.spacer} />
          <h1 className={styles.name}>Shayaan Azeem</h1>
          <div className={styles.footer} aria-hidden="true">
            <span>Memo Book</span>
            <span>Pocket Size</span>
          </div>
        </section>
      </div>
    </main>
  );
}
