import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Layout.module.css";

const NAV = [
  { href: "/writing", label: "writing" },
  { href: "/projects", label: "projects" },
  { href: "/investments", label: "investments" },
];

export default function Layout({
  children,
  active,
}: {
  children: ReactNode;
  active?: string;
}) {
  return (
    <>
      <main>
        <div className={styles.container}>
          <section className={styles.header}>
            <Link href="/">
              <h1 className={styles.name}>Shayaan Azeem</h1>
            </Link>
            <div className={styles.nav}>
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`${styles.navLink} ${
                      active === item.href ? styles.navLinkActive : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <div className={styles.content}>{children}</div>
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <p>© shayaanazeem.com</p>
          </div>
        </div>
      </footer>
    </>
  );
}
