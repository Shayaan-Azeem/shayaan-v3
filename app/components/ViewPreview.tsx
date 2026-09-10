"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./ViewPreview.module.css";

const PREVIEW_WIDTH = 218;
const PREVIEW_HEIGHT = 123;
const PORTRAIT_WIDTH = 164;
const PORTRAIT_HEIGHT = 220;
const SQUARE_SIZE = 184;
const PREVIEW_GAP = 14;
const VIEWPORT_GUTTER = 12;

type Position = {
  x: number;
  y: number;
};

export default function ViewPreview({
  src,
  alt,
  children,
  className,
  shape = "landscape",
  fit = "cover",
}: {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
  shape?: "landscape" | "portrait" | "square";
  fit?: "cover" | "contain";
}) {
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const previewSize =
    shape === "portrait"
      ? { width: PORTRAIT_WIDTH, height: PORTRAIT_HEIGHT }
      : shape === "square"
        ? { width: SQUARE_SIZE, height: SQUARE_SIZE }
        : { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT };

  useEffect(() => {
    const host = document.createElement("div");
    host.className = styles.portalHost;
    document.documentElement.appendChild(host);
    setPortalHost(host);

    return () => host.remove();
  }, []);

  function updatePosition(clientX: number, clientY: number) {
    let x = clientX + PREVIEW_GAP;
    let y = clientY + PREVIEW_GAP;

    if (x + previewSize.width > window.innerWidth - VIEWPORT_GUTTER) {
      x = clientX - previewSize.width - PREVIEW_GAP;
    }

    if (y + previewSize.height > window.innerHeight - VIEWPORT_GUTTER) {
      y = clientY - previewSize.height - PREVIEW_GAP;
    }

    setPosition({
      x: Math.max(VIEWPORT_GUTTER, x),
      y: Math.max(VIEWPORT_GUTTER, y),
    });
  }

  function showAt(clientX: number, clientY: number) {
    setActivated(true);
    updatePosition(clientX, clientY);
    setVisible(true);
  }

  function handlePointerEnter(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType === "touch") return;
    showAt(event.clientX, event.clientY);
  }

  function handlePointerMove(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType === "touch") return;
    updatePosition(event.clientX, event.clientY);
  }

  function handleFocus(event: FocusEvent<HTMLSpanElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    showAt(rect.right, rect.top + rect.height / 2);
  }

  const previewStyle = {
    "--view-preview-x": `${position.x}px`,
    "--view-preview-y": `${position.y}px`,
  } as CSSProperties;

  return (
    <span
      className={`${styles.trigger} ${className ?? ""}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setVisible(false)}
      onFocus={handleFocus}
      onBlur={() => setVisible(false)}
    >
      {children}
      {portalHost && activated
        ? createPortal(
            <span
              className={`${styles.preview} ${
                shape === "portrait"
                  ? styles.portrait
                  : shape === "square"
                    ? styles.square
                    : ""
              } ${fit === "contain" ? styles.contain : ""} ${
                visible ? styles.visible : ""
              }`}
              style={previewStyle}
              role="tooltip"
              aria-hidden={!visible}
            >
              {/* A native image keeps this utility compatible with local and remote previews. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} />
            </span>,
            portalHost,
          )
        : null}
    </span>
  );
}
