import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Layout.module.css";

const NAV = [
  { href: "/projects", label: "projects" },
  { href: "/fieldnotes", label: "fieldnotes" },
  { href: "/philosophy", label: "philosophy" },
  { href: "/events", label: "events" },
  { href: "/favourites", label: "favourites" },
];

export default function Layout({
  children,
  active,
  className,
  wide = false,
}: {
  children: ReactNode;
  active?: string;
  className?: string;
  wide?: boolean;
}) {
  return (
    <main className={className}>
      <div
        className={`${styles.container} ${wide ? styles.containerWide : ""}`}
      >
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
  );
}
