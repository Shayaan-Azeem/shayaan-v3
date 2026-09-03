"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import styles from "../page.module.css";

const MAX_TILT = 9;

export default function Notebook() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || open) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
    el.style.setProperty("--ry", `${((x - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--gloss", "1");
  };

  const rest = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--gloss", "0");
  };

  const toggle = () => {
    rest();
    setOpen((v) => !v);
  };

  return (
    <div
      ref={ref}
      className={`${styles.stack} ${open ? styles.isOpen : ""}`}
      onPointerMove={onMove}
      onPointerLeave={rest}
    >
      <div className={styles.pages} aria-hidden="true" />

      <div className={styles.spread}>
        <span className={styles.pageShadow} aria-hidden="true" />
        <nav className={styles.inside} aria-label="Primary">
          <Link href="/writing">Writing</Link>
          <Link href="/about">About Me</Link>
          <Link href="/experience">Experience</Link>
        </nav>
      </div>

      <button
        type="button"
        className={styles.notebook}
        aria-expanded={open}
        aria-label={open ? "Close notebook" : "Open notebook"}
        onClick={toggle}
      >
        <span className={styles.staples} aria-hidden="true">
          <span className={styles.staple} />
          <span className={styles.staple} />
        </span>
        <span className={styles.stickers} aria-hidden="true">
          <span className={`${styles.sticker} ${styles.s1}`}>
            <svg viewBox="0 0 48 48" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round">
              <path d="M14 18v4M34 18v4M13 30c4 6 18 6 22 0" />
            </svg>
          </span>

          <span className={`${styles.sticker} ${styles.s2}`}>hi :)</span>

          <span className={`${styles.sticker} ${styles.s3}`}>
            <svg viewBox="0 0 48 48" fill="#111">
              <path d="M24 2c2 12 8 18 20 22-12 4-18 10-20 22-2-12-8-18-20-22C16 20 22 14 24 2Z" />
            </svg>
          </span>

          <span className={`${styles.sticker} ${styles.s4}`}>TORONTO</span>

          <span className={`${styles.sticker} ${styles.s5}`}>
            <svg viewBox="0 0 48 48" fill="#111">
              <path d="M27 2 8 27h12L19 46l21-27H27l4-17Z" />
            </svg>
          </span>

          <span className={`${styles.sticker} ${styles.s6}`}>
            <span className={styles.photo} />
          </span>
        </span>

        <span className={styles.spacer} />
        <span className={styles.name}>
          Shayaan
          <br />
          Azeem
        </span>
        <span className={styles.gloss} aria-hidden="true" />
        <span className={styles.coverBack} aria-hidden="true" />
      </button>
    </div>
  );
}
