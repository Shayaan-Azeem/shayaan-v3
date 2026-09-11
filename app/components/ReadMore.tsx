"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./ReadMore.module.css";

export default function ReadMore({
  summary,
  summaryClassName,
  children,
}: {
  summary: ReactNode;
  summaryClassName?: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={styles.readMore}>
      <p className={summaryClassName}>
        {summary}{" "}
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "Read Less" : "Read More"}
        </button>
      </p>
      <div
        id={panelId}
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className={styles.panelContent}>{children}</div>
      </div>
    </div>
  );
}
