"use client";

import { useRef } from "react";
import { HIDDEN_VIDEO_STYLE, useSampledVideo } from "./pixelCanvas";
import { useVideoPlayback } from "./videoPlayback";

export default function SampledVideoCanvas({
  src,
  paused,
  className,
  alt,
  columns,
  rows,
  frameInterval,
  paint,
  onPlaybackChange,
}: {
  src: string;
  paused: boolean;
  className?: string;
  alt: string;
  columns: number;
  rows: number;
  frameInterval: number;
  onPlaybackChange?: (playing: boolean) => void;
  paint: (
    context: CanvasRenderingContext2D,
    pixels: Uint8ClampedArray,
    columns: number,
    rows: number,
  ) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useSampledVideo({
    canvasRef,
    videoRef,
    columns,
    rows,
    frameInterval,
    paint,
    src,
  });
  useVideoPlayback({
    videoRef,
    targetRef: canvasRef,
    src,
    paused,
    onPlaybackChange,
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className}
        role="img"
        aria-label={alt}
        style={{ position: "absolute", inset: 0, opacity: 0 }}
      />
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        style={HIDDEN_VIDEO_STYLE}
      />
    </>
  );
}
