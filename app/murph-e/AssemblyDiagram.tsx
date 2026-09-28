"use client";

import { useEffect, useRef, useState } from "react";
import { scrollProgress } from "../../public/murph-e/model/motion.js";
import styles from "./assembly.module.css";

export default function AssemblyDiagram() {
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const update = useRef<() => void>(() => {});
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const initialize = () => {
    // An eager iframe can fail before React attaches its message listener.
    if (iframe.current?.contentDocument?.body?.dataset.murpheStatus === "error") setStatus("fallback");
    else iframe.current?.contentWindow?.postMessage({ type: "murphe-init" }, location.origin);
    update.current();
  };

  useEffect(() => {
    if (status === "ready") update.current();
  }, [status]);

  useEffect(() => {
    const root = section.current!, sticky = panel.current!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, near = false;
    const sync = () => {
      const progress = (motion.matches ? 1 : scrollProgress(root.getBoundingClientRect().top, root.offsetHeight, sticky.offsetHeight));
      const bounds = sticky.getBoundingClientRect();
      const visible = bounds.bottom > 0 && bounds.top < innerHeight;
      iframe.current?.contentWindow?.postMessage({ type: "murphe-progress", progress, visible }, location.origin);
    };
    update.current = sync;
    const schedule = () => {
      if (!near || frame || document.hidden) return;
      frame = requestAnimationFrame(() => { frame = 0; sync(); });
    };
    const changeMotion = () => sync();
    sync();
    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) schedule();
      else sync();
    }, { rootMargin: "600px" });
    observer.observe(root);
    const resize = new ResizeObserver(schedule); resize.observe(sticky); resize.observe(root);
    const receive = (event: MessageEvent) => {
      if (event.source !== iframe.current?.contentWindow || event.origin !== location.origin) return;
      if (event.data?.type === "murphe-ready") { setStatus("ready"); sync(); }
      if (event.data?.type === "murphe-error") setStatus("fallback");
    };
    window.addEventListener("message", receive);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", changeMotion);
    initialize();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect();
      window.removeEventListener("message", receive);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", changeMotion);
      update.current = () => {};
    };
  }, []);

  return (
    <section ref={section} data-status={status} className={`${styles.section} ${status === "fallback" ? styles.fallback : ""}`} aria-label="Arcade assembly diagram">
      <div ref={panel} className={styles.panel}>
        <div className={styles.stage}>
          {status === "fallback" && <p className={styles.loading} role="status">The 3D model couldn’t load.</p>}
          {status !== "fallback" && <iframe ref={iframe} className={styles.model} src="/murph-e/model/index.html" onLoad={initialize} onError={() => setStatus("fallback")} title="Scroll-controlled 3D assembly of Murph-E" tabIndex={-1} aria-hidden="true" style={{ opacity: status === "ready" ? 1 : 0 }} />}
        </div>

      </div>
    </section>
  );
}
