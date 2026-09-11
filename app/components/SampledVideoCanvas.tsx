"use client";

import { useRef } from "react";
import { HIDDEN_VIDEO_STYLE, useSampledVideo } from "./pixelCanvas";

export default function SampledVideoCanvas({
  src,
  poster,
  className,
  alt,
  columns,
  rows,
  frameInterval,
  paint,
}: {
  src: string;
  poster?: string;
  className?: string;
  alt: string;
  columns: number;
  rows: number;
  frameInterval: number;
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

  return (
    <>
      <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />
      <video
        ref={videoRef}
        src={src}
        poster={poster}
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
