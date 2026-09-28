"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import styles from "./image-preview.module.css";

export default function InlineImagePreview({ label, src, alt, width, height, logo }: {
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  logo?: string;
}) {
  const previewId = useId();
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const dismiss = () => {
    setOpen(false);
    setPinned(false);
    if (pinned) trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    if (pinned) closeButton.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        setPinned(false);
        if (pinned) trigger.current?.focus();
      }
      if (pinned && event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [open, pinned]);

  return <>
    <button ref={trigger} type="button" className={`${styles.trigger} ${logo ? styles.logoTrigger : ""}`} aria-label={label}
      aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? previewId : undefined}
      onMouseEnter={() => { if (matchMedia("(hover: hover) and (pointer: fine)").matches) setOpen(true); }}
      onMouseLeave={() => { if (!pinned) setOpen(false); }}
      onClick={() => { setOpen(true); setPinned(true); }}>
      {logo ? <Image src={logo} alt="" width={285} height={60} className={styles.logo} /> : label}
    </button>
    {open && createPortal(
      <div className={`${styles.overlay} ${pinned ? styles.pinned : ""}`} onClick={dismiss}>
        <div id={previewId} className={styles.card} role="dialog" aria-modal={pinned || undefined}
          aria-label={`${label} preview`} onClick={(event) => event.stopPropagation()}>
          {pinned && <button ref={closeButton} type="button" className={styles.close} aria-label={`Close ${label} preview`} onClick={dismiss}><X size={18} aria-hidden="true" /></button>}
          <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 720px) calc(100vw - 48px), 648px" />
        </div>
      </div>, document.body
    )}
  </>;
}
