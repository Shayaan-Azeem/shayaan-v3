import Link from "next/link";
import styles from "./Page.module.css";

export default function Page({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <main className={styles.main}>
      <Link href="/" className={styles.back}>
        &larr; Back
      </Link>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.body}>{children}</div>
    </main>
  );
}
