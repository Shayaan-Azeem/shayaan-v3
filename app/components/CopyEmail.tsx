"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";

const EMAIL = "shayaanazeem10@gmail.com";

export default function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyEmail() {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      className={styles.copyEmail}
      type="button"
      aria-label={copied ? "Email copied" : "Copy email address"}
      onClick={copyEmail}
    >
      {copied ? "copied" : "email"}
    </button>
  );
}
