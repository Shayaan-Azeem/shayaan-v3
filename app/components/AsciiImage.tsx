"use client";

import { useEffect, useRef } from "react";
import {
  createSampler,
  paintAsciiFrame,
  resizeToDisplaySize,
  sampleSource,
} from "./pixelCanvas";

const COLUMNS = 120;
const ROWS = 90;

export default function AsciiImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const sampler = createSampler(COLUMNS, ROWS);
    if (!context || !sampler) return;

    const source = new window.Image();

    const draw = () => {
      if (!source.complete || source.naturalWidth === 0) return;

      resizeToDisplaySize(canvas);
      const pixels = sampleSource(
        sampler,
        source,
        source.naturalWidth,
        source.naturalHeight,
      );
      paintAsciiFrame(context, pixels, COLUMNS, ROWS);
    };

    source.addEventListener("load", draw);
    source.src = src;
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);

    return () => {
      source.removeEventListener("load", draw);
      resizeObserver.disconnect();
    };
  }, [src]);

  return (
    <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />
  );
}
