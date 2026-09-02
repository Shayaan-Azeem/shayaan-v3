"use client";

import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import styles from "../page.module.css";

const MAX_TILT = 9;

export default function Notebook() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
    el.style.setProperty("--ry", `${((x - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--gloss", "1");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--gloss", "0");
  };

  return (
    <div
      ref={ref}
      className={styles.stack}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
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
        <h1 className={styles.name}>
          Shayaan
          <br />
          Azeem
        </h1>
        <div className={styles.gloss} aria-hidden="true" />
      </section>
    </div>
  );
}
