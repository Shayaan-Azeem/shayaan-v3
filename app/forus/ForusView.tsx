"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import useReducedMotion from "../components/useReducedMotion";
import { requestVideoPlayback, useVideoPlayback } from "../components/videoPlayback";
import BackpackLink from "../components/BackpackLink";
import { getBackpackPath, isPlainNavigation } from "../lib/backpackNavigation";
import { articleHtml } from "./articleContent";
import { initializeArticle } from "./articleRuntime";
import styles from "./forus.module.css";
import sharedStyles from "../page.module.css";
import "./article.css";

export default function ForusView() {
  const article = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const videoFrame = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [pauseOverride, setPauseOverride] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  useVideoPlayback({
    videoRef: video,
    targetRef: videoFrame,
    src: "/projects/forus-prior-authorization.mp4",
    paused: pauseOverride ?? reducedMotion,
    onPlaybackChange: setPlaying,
  });

  useEffect(() => {
    const root = article.current;
    if (!root) return;
    // Restore the original markup before each initialization, including React's
    // development remount check, so demos never acquire duplicate listeners.
    root.innerHTML = articleHtml;
    return initializeArticle(root);
  }, [articleHtml]);

  return (
    <main>
      <nav className={styles.navigation} aria-label="Forus navigation">
        <BackpackLink
          href="/"
          onClick={(event) => {
            if (!isPlainNavigation(event, event.currentTarget.target, false)) return;
            const from = window.history.state?.backpackFrom;
            if (typeof from === "string" && getBackpackPath(from)) {
              event.preventDefault();
              window.history.back();
            }
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </BackpackLink>
        <a href="https://forus.com/" target="_blank" rel="noopener noreferrer">
          Website <ExternalLink size={14} aria-hidden="true" />
        </a>
      </nav>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Forus</h1>
        <p className={styles.heroMeta}>Summer 2026</p>
        <div ref={videoFrame} className={styles.heroVideo}>
          <video ref={video} src="/projects/forus-prior-authorization.mp4" muted loop playsInline preload="none" aria-hidden="true" />
          <Image className={styles.heroLogo} src="/projects/forus-light.svg" alt="" width={499} height={136} loading="eager" />
          <button
            type="button"
            className={`${sharedStyles.videoPlaybackToggle} ${styles.videoToggle}`}
            aria-label={`${playing ? "Pause" : "Play"} Forus video`}
            onClick={() => {
              setPauseOverride(playing);
              if (video.current) requestVideoPlayback(video.current, playing);
            }}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d={playing
                ? "M5.9 3.917c.653 0 1.183.53 1.183 1.183v5.8c0 .653-.53 1.184-1.183 1.184H4.767c-.654 0-1.184-.53-1.184-1.184V5.1c0-.653.53-1.183 1.184-1.183zm5.334 0c.653 0 1.183.53 1.183 1.183v5.8c0 .653-.53 1.183-1.183 1.184H10.1c-.654 0-1.184-.53-1.184-1.184V5.1c0-.653.53-1.183 1.184-1.183z"
                : "M4.848 4.69a1.167 1.167 0 0 1 1.8-.98l5.125 3.31c.711.46.711 1.5 0 1.96l-5.125 3.31a1.167 1.167 0 0 1-1.8-.98z"} />
            </svg>
          </button>
        </div>
      </header>
      <div
        id="main-content"
        ref={article}
        className="forus-article"
        tabIndex={-1}
        dangerouslySetInnerHTML={{ __html: articleHtml }}
      />
    </main>
  );
}
