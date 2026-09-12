import Link from "./BackpackLink";
import type { ReactNode } from "react";
import styles from "./Layout.module.css";
import NavIcon from "./NavIcons";

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
        <header className={styles.header}>
          <Link href="/">
            {active ? <span className={styles.name}>Shayaan Azeem</span> : <h1 className={styles.name}>Shayaan Azeem</h1>}
          </Link>
          <nav className={styles.nav} aria-label="Main navigation">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-label={item.label} aria-current={active === item.href ? "page" : undefined} title={item.label}>
                <span
                  className={`${styles.navLink} ${
                    active === item.href ? styles.navLinkActive : ""
                  }`}
                >
                  <span className={styles.navIcon}>
                    <NavIcon href={item.href} active={active === item.href} />
                  </span>
                  <span className={styles.navLabel}>{item.label}</span>
                </span>
              </Link>
            ))}
          </nav>
        </header>
        <div id="main-content" className={styles.content} tabIndex={-1}>
          {active ? <h1 className="sr-only">{NAV.find((item) => item.href === active)?.label}</h1> : null}
          {children}
        </div>
      </div>
    </main>
  );
}
