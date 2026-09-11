"use client";

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import type { SkylineLandmark } from "./skylineMask";
import { createSkylineCaptionController, SKYLINE_CAPTIONS, SKYLINE_SONGS } from "./skylineCaptionPosition";
import styles from "./SkylineCaptions.module.css";

type ActiveCaption = {
  landmark: SkylineLandmark;
  link: HTMLElement;
  mode: "pointer" | "anchor";
};

export default function SkylineCaptions({ landmarks }: { landmarks: SkylineLandmark[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef<ActiveCaption | null>(null);
  const controllerRef = useRef<ReturnType<typeof createSkylineCaptionController> | null>(null);
  const finePointerRef = useRef<MediaQueryList | null>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

  useEffect(() => { setPortalHost(document.body); }, []);

  function dismiss() {
    activeRef.current?.link.removeAttribute("data-cursor-active");
    activeRef.current = null;
    controllerRef.current?.hide();
  }

  useLayoutEffect(() => {
    const caption = captionRef.current;
    const label = labelRef.current;
    if (!caption || !label) return;
    const controller = createSkylineCaptionController(
      caption, label, () => ({ width: window.innerWidth, height: window.innerHeight }),
    );
    controllerRef.current = controller;
    let disposed = false;
    const invalidate = () => { dismiss(); controller.invalidate(); };
    const keyDown = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    const pointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) dismiss();
    };
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    finePointerRef.current = pointer;
    window.addEventListener("blur", dismiss);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", invalidate);
    document.addEventListener("visibilitychange", dismiss);
    document.addEventListener("keydown", keyDown);
    document.addEventListener("pointerdown", pointerDown);
    pointer.addEventListener("change", dismiss);
    document.fonts.addEventListener("loadingdone", invalidate);
    void document.fonts.ready.then(() => { if (!disposed) invalidate(); });
    return () => {
      disposed = true;
      dismiss();
      controllerRef.current = null;
      finePointerRef.current = null;
      window.removeEventListener("blur", dismiss);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", invalidate);
      document.removeEventListener("visibilitychange", dismiss);
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("pointerdown", pointerDown);
      pointer.removeEventListener("change", dismiss);
      document.fonts.removeEventListener("loadingdone", invalidate);
    };
  }, [portalHost]);

  function activate(landmark: SkylineLandmark, link: HTMLElement, mode: ActiveCaption["mode"]) {
    const previous = activeRef.current;
    if (previous?.link !== link) previous?.link.removeAttribute("data-cursor-active");
    activeRef.current = { landmark, link, mode };
    if (mode === "pointer") link.setAttribute("data-cursor-active", "true");
    else link.removeAttribute("data-cursor-active");
  }

  function showAnchored(landmark: SkylineLandmark, link: HTMLElement) {
    const rect = link.getBoundingClientRect();
    activate(landmark, link, "anchor");
    controllerRef.current?.show(landmark.place, rect.left + rect.width / 2, rect.top - 26);
  }

  function showAtPointer(landmark: SkylineLandmark, event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "touch" || !finePointerRef.current?.matches || !controllerRef.current) return;
    if (activeRef.current?.link === event.currentTarget && activeRef.current.mode === "pointer") {
      controllerRef.current.move(event.clientX, event.clientY);
      return;
    }
    activate(landmark, event.currentTarget, "pointer");
    controllerRef.current.show(landmark.place, event.clientX, event.clientY);
  }

  return (
    <div ref={rootRef} className={styles.landmarks}>
      {landmarks.map((landmark) => {
        // A slightly wider target makes thin spires usable, including on touch.
        const targetWidth = Math.max(landmark.width, 24);
        const song = SKYLINE_SONGS[landmark.place];
        const Target = song ? "a" : "button";
        return (
          <Target
            key={landmark.id}
            href={song?.href}
            target={song ? "_blank" : undefined}
            rel={song ? "noopener noreferrer" : undefined}
            type={song ? undefined : "button"}
            className={styles.landmark}
            style={{
              left: landmark.left - (targetWidth - landmark.width) / 2,
              top: landmark.top,
              width: targetWidth,
              height: landmark.height,
            }}
            aria-label={`${landmark.name}, ${SKYLINE_CAPTIONS[landmark.place]}${song ? `: Listen to ${song.title} by ${song.artist} on Spotify (opens in a new tab)` : ""}`}
            data-skyline-landmark={landmark.id}
            onPointerEnter={(event) => showAtPointer(landmark, event)}
            onPointerMove={(event) => showAtPointer(landmark, event)}
            onPointerLeave={(event) => {
              if (activeRef.current?.mode !== "pointer") return;
              // Moving directly to another landmark must not hide/remount the
              // label or briefly restore the native cursor between captions.
              const next = event.relatedTarget;
              if (next instanceof Element && rootRef.current?.contains(next) && next.closest("[data-skyline-landmark]")) return;
              dismiss();
            }}
            onPointerCancel={dismiss}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) showAnchored(landmark, event.currentTarget);
            }}
            onBlur={(event) => {
              if (activeRef.current?.mode === "anchor" && activeRef.current.link === event.currentTarget) dismiss();
            }}
            onClick={(event) => {
              if (song) dismiss();
              else showAnchored(landmark, event.currentTarget);
            }}
          />
        );
      })}
      {portalHost && createPortal(
        <div ref={captionRef} className={styles.cursor} aria-hidden="true">
          <span ref={labelRef} className={styles.bubble} />
        </div>,
        portalHost,
      )}
    </div>
  );
}
