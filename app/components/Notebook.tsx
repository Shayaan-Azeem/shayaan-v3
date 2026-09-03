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
