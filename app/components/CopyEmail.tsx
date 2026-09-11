"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";

const EMAIL = "shayaanazeem10@gmail.com";

export default function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyEmail() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(EMAIL);
      setFailed(false);
      setCopied(true);
      resetTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
      setFailed(true);
    }
  }

  return (
    <>
      <button
        className={styles.copyEmail}
        type="button"
        aria-label={copied ? "Email copied" : "Copy email address"}
        onClick={copyEmail}
      >
        {copied ? "copied" : "email"}
      </button>
      <span role="status" className={failed ? styles.emailFallback : "sr-only"}>
        {failed ? (
          <>Copy unavailable. Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a></>
        ) : copied ? "Email address copied to clipboard." : ""}
      </span>
    </>
  );
}
