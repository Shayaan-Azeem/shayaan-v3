"use client";

import Image from "next/image";
import BackpackLink from "../components/BackpackLink";
import { useRef, useState } from "react";
import AsciiImage from "../components/AsciiImage";
import AsciiVideo from "../components/AsciiVideo";
import HalftoneVideo from "../components/HalftoneVideo";
import useReducedMotion from "../components/useReducedMotion";
import { requestVideoPlayback, useVideoPlayback } from "../components/videoPlayback";
import styles from "../page.module.css";
import type { Project } from "./data";
import videoPosters from "./videoPosters.json";

export default function ProjectMedia({
  project,
  sizes,
  eager = false,
}: {
  project: Project;
  sizes: string;
  eager?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [pauseOverride, setPauseOverride] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const paused = pauseOverride ?? reducedMotion;
  const poster = project.video
    ? (videoPosters as Record<string, string>)[project.video]
    : undefined;
  useVideoPlayback({ videoRef, targetRef: frameRef, src: project.video ?? "", paused, onPlaybackChange: setPlaying });

  function togglePlayback() {
    setPauseOverride(playing);
    const video = frameRef.current?.querySelector("video");
    if (!video) return;
    requestVideoPlayback(video, playing);
  }

  return (
    <span ref={frameRef} className={styles.projectMediaFrame}>
      <BackpackLink
        className={styles.projectMediaLink}
        href={project.href}
        target={project.href.startsWith("/") ? undefined : "_blank"}
        rel={project.href.startsWith("/") ? undefined : "noopener noreferrer"}
        aria-label={`View ${project.title}`}
      >
        <span
          style={poster ? {
            backgroundImage: `url("${poster}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } : undefined}
          className={`${styles.homeProjectImage} ${
            project.overlayLogo ? styles.homeProjectImageBranded : ""
          } ${project.shortMedia ? styles.homeProjectImageShort : ""}`}
        >
          {project.imageEffect === "ascii" ? (
            <AsciiImage
              src={project.images[0]}
              alt={`${project.title} project preview rendered as ASCII art`}
              className={styles.homeProjectAscii}
            />
          ) : project.videoEffect === "ascii" && project.video ? (
            <AsciiVideo
              src={project.video}
              paused={paused}
              onPlaybackChange={setPlaying}
              alt={`${project.title} project preview rendered as ASCII art`}
              className={styles.homeProjectAscii}
            />
          ) : project.videoEffect === "halftone" && project.video ? (
            <HalftoneVideo
              src={project.video}
              paused={paused}
              onPlaybackChange={setPlaying}
              alt={`${project.title} montage rendered as a field of dots`}
              className={styles.homeProjectHalftone}
            />
          ) : project.video ? (
            <video
              ref={videoRef}
              src={project.video}
              muted
              poster={poster}
              loop
              playsInline
              preload="none"
              aria-hidden="true"
            />
          ) : (
            <Image
              src={project.images[0]}
              alt={`${project.title} project preview`}
              fill
              sizes={sizes}
              loading={eager ? "eager" : "lazy"}
            />
          )}
          {project.overlayLogo ? (
            <span className={styles.homeProjectLogo}>
              <Image src={project.overlayLogo} alt="" width={499} height={136} loading={eager ? "eager" : "lazy"} />
            </span>
          ) : null}
          {project.overlayText ? (
            <span className={styles.homeProjectWordmark}>
              {project.overlayText}
            </span>
          ) : null}
        </span>
      </BackpackLink>
      {project.video ? (
        <button
          type="button"
          className={styles.videoPlaybackToggle}
          aria-label={`${playing ? "Pause" : "Play"} ${project.title} video`}
          onClick={togglePlayback}
        >
          {!playing ? (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4.848 4.69a1.167 1.167 0 0 1 1.8-.98l5.125 3.31c.711.46.711 1.5 0 1.96l-5.125 3.31a1.167 1.167 0 0 1-1.8-.98z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5.9 3.917c.653 0 1.183.53 1.183 1.183v5.8c0 .653-.53 1.184-1.183 1.184H4.767c-.654 0-1.184-.53-1.184-1.184V5.1c0-.653.53-1.183 1.184-1.183zm5.334 0c.653 0 1.183.53 1.183 1.183v5.8c0 .653-.53 1.183-1.183 1.184H10.1c-.654 0-1.184-.53-1.184-1.184V5.1c0-.653.53-1.183 1.184-1.183z" />
            </svg>
          )}
        </button>
      ) : null}
    </span>
  );
}
