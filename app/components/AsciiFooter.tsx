"use client";

import { useEffect, useRef, useState } from "react";
import { createCloudSkyMask, renderAsciiSkyline } from "./asciiSkyline";
import { type CloudMask, renderAsciiClouds, sampleCloudImage } from "./asciiClouds";
import { loadSkylineImages, sampleSkyline, type SkylineLandmark } from "./skylineMask";
import SkylineCaptions from "./SkylineCaptions";
import styles from "./AsciiFooter.module.css";

export default function AsciiFooter() {
  const rootRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLPreElement>(null);
  const cloudsRef = useRef<HTMLPreElement>(null);
  const glowRef = useRef<HTMLPreElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [landmarks, setLandmarks] = useState<SkylineLandmark[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const base = baseRef.current;
    const clouds = cloudsRef.current;
    const glow = glowRef.current;
    const measure = measureRef.current;
    if (!root || !base || !clouds || !glow || !measure) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let disposed = false;
    let visible = false;
    let frame: number | null = null;
    let lastPaint = 0;
    let time = Math.random() * 11;
    let cloudSeconds = 0;
    let lastCloudPaint = -Infinity;
    let columns = 0;
    let rows = 0;
    let cellAspect = 0.6;
    let cloudMask: CloudMask | null = null;
    let images: Awaited<ReturnType<typeof loadSkylineImages>> | null = null;
    let coverage = new Float32Array(0);
    let sky = new Uint8Array(0);
    let lastText = "";
    let lastCloudText = "";
    let glowActive = false;
    let pointerBounds: DOMRect | null = null;
    let lastSize = "";
    let loading = false;

    function paint() {
      if (!base || !clouds || !glow || !columns || !rows || !coverage.length) return;
      const text = renderAsciiSkyline(columns, rows, coverage, time);
      if (text !== lastText) {
        lastText = text;
        base.textContent = text;
        // Keep the intro highlights ready for their CSS hover/focus states,
        // including a still frame when reduced motion is enabled.
        glow.textContent = text;
      }
      // Share the skyline's animation lifecycle at the more visible drift speed,
      // freezing offscreen, in hidden tabs, and with reduced motion.
      if (cloudSeconds - lastCloudPaint >= 1 / 30) {
        const cloudText = renderAsciiClouds(columns, rows, sky, cloudSeconds, cloudMask, cellAspect);
        lastCloudPaint = cloudSeconds;
        if (cloudText !== lastCloudText) {
          lastCloudText = cloudText;
          clouds.textContent = cloudText;
        }
      }
    }

    function tick(now: number) {
      frame = null;
      if (disposed || !visible || !images || document.hidden || motion.matches) return;
      if (now - lastPaint >= 1000 / 30) {
        // Match the source's slow 30fps drift without speeding up after tabbing back.
        const elapsed = Math.min(now - lastPaint, 66.67);
        time += elapsed * 0.000033;
        cloudSeconds += elapsed / 1000;
        lastPaint = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    }

    function syncAnimation() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      if (!disposed && visible && images && !document.hidden) {
        paint();
        if (!motion.matches) {
          lastPaint = performance.now();
          frame = requestAnimationFrame(tick);
        }
      }
    }

    function resize() {
      if (disposed || !root || !measure) return;
      if (!root.clientWidth || !root.clientHeight) return;
      const cell = measure.getBoundingClientRect();
      cellAspect = cell.width / Math.max(cell.height, 1);
      const size = `${root.clientWidth}:${root.clientHeight}:${cell.width}:${cell.height}:${Boolean(images)}`;
      if (size === lastSize) return;
      lastSize = size;
      pointerBounds = null;
      columns = Math.ceil(root.clientWidth / Math.max(cell.width, 1));
      rows = Math.ceil(root.clientHeight / Math.max(cell.height, 1));
      if (images) {
        coverage = sampleSkyline(images, columns * cell.width, rows * cell.height, columns, rows, setLandmarks, (bounds) => {
          // Match the E7 artwork's actual sampled bounds at every viewport size.
          root.style.setProperty("--waterloo-clip", bounds
            ? `inset(${bounds.top}px ${Math.max(0, root.clientWidth - bounds.left - bounds.width)}px 0 ${bounds.left}px)`
            : "inset(100%)");
          root.style.setProperty("--waterloo-top", `${bounds?.top ?? 0}px`);
          root.style.setProperty("--waterloo-height", `${bounds?.height ?? 0}px`);
        });
        sky = createCloudSkyMask(columns, rows, coverage);
        lastCloudPaint = -Infinity;
      }
      paint();
    }

    function hideGlow() {
      glowActive = false;
      if (glow) glow.style.opacity = "0";
    }

    function resetPointerBounds() {
      pointerBounds = null;
      hideGlow();
    }

    function enterPointer() {
      if (root) pointerBounds = root.getBoundingClientRect();
    }

    function movePointer(event: PointerEvent) {
      if (!root || !glow || !finePointer.matches || motion.matches) return;
      // Measuring after every animated text update forced the whole ASCII
      // layer through layout on each mouse move. Its bounds are stable until
      // entering, scrolling, or resizing the footer.
      const rect = pointerBounds ?? (pointerBounds = root.getBoundingClientRect());
      if (!glowActive) glow.textContent = lastText;
      glowActive = true;
      root.style.setProperty("--ascii-hover-x", `${event.clientX - rect.left}px`);
      root.style.setProperty("--ascii-hover-y", `${event.clientY - rect.top}px`);
      glow.style.opacity = "0.75";
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !loading) {
        loading = true;
        void loadSkylineImages().then((loaded) => {
          if (disposed) return;
          images = loaded;
          cloudMask = loaded.cloud ? sampleCloudImage(loaded.cloud) : null;
          resize();
          syncAnimation();
        }).catch(() => { loading = false; });
      }
      syncAnimation();
    });
    const resizeObserver = new ResizeObserver(resize);
    resize();
    intersection.observe(root);
    resizeObserver.observe(root);
    void document.fonts.ready.then(() => { if (!disposed) resize(); });
    document.addEventListener("visibilitychange", syncAnimation);
    motion.addEventListener("change", syncAnimation);
    root.addEventListener("pointerenter", enterPointer, { passive: true });
    root.addEventListener("pointermove", movePointer, { passive: true });
    root.addEventListener("pointerleave", hideGlow);
    window.addEventListener("blur", hideGlow);
    window.addEventListener("scroll", resetPointerBounds, true);

    return () => {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
      motion.removeEventListener("change", syncAnimation);
      root.removeEventListener("pointerenter", enterPointer);
      root.removeEventListener("pointermove", movePointer);
      root.removeEventListener("pointerleave", hideGlow);
      window.removeEventListener("blur", hideGlow);
      window.removeEventListener("scroll", resetPointerBounds, true);
    };
  }, []);

  return (
    <footer className={styles.footer} aria-label="A cityscape featuring One World Trade Center, the Empire State Building, Waterloo Engineering 7, and landmarks from Toronto and Lahore, Pakistan">
      <div ref={rootRef} className={styles.artwork}>
        <pre ref={cloudsRef} className={styles.clouds} aria-hidden="true" />
        <pre ref={baseRef} className={styles.skyline} aria-hidden="true" />
        <pre ref={glowRef} className={styles.glow} aria-hidden="true" />
        <span ref={measureRef} className={styles.measure} aria-hidden="true">0</span>
        <SkylineCaptions landmarks={landmarks} />
      </div>
    </footer>
  );
}
