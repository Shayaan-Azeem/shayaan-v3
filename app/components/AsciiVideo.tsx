"use client";

import { useEffect, useRef } from "react";

const GLYPHS = " .,:;irsXA253hMHGS#9B&@";

export default function AsciiVideo({
  src,
  poster,
  className,
  alt = "Video rendered as animated ASCII art",
  loop = true,
  onEnded,
  columns = 120,
  rows = 90,
}: {
  src: string;
  poster?: string;
  className?: string;
  alt?: string;
  loop?: boolean;
  onEnded?: () => void;
  columns?: number;
  rows?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const context = canvas.getContext("2d");
    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!context || !sampleContext) return;

    sampleCanvas.width = columns;
    sampleCanvas.height = rows;

    let animationFrame = 0;
    let lastFrame = 0;
    let isVisible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const density = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * density));
      canvas.height = Math.max(1, Math.round(rect.height * density));
    };

    const draw = (time: number) => {
      animationFrame = requestAnimationFrame(draw);
      if (!isVisible || video.readyState < 2 || time - lastFrame < 42) return;
      lastFrame = time;

      const sourceRatio = video.videoWidth / video.videoHeight;
      const targetRatio = columns / rows;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = video.videoWidth;
      let sourceHeight = video.videoHeight;

      if (sourceRatio > targetRatio) {
        sourceWidth = video.videoHeight * targetRatio;
        sourceX = (video.videoWidth - sourceWidth) / 2;
      } else {
        sourceHeight = video.videoWidth / targetRatio;
        sourceY = (video.videoHeight - sourceHeight) / 2;
      }

      sampleContext.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        columns,
        rows,
      );

      const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
      const cellWidth = canvas.width / columns;
      const cellHeight = canvas.height / rows;
      const fontSize = Math.ceil(cellHeight * 0.78);

      context.fillStyle = "#0c100b";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          const offset = (y * columns + x) * 4;
          const red = pixels[offset];
          const green = pixels[offset + 1];
          const blue = pixels[offset + 2];
          const brightness = red * 0.2126 + green * 0.7152 + blue * 0.0722;
          const glyph = GLYPHS[Math.round((brightness / 255) * (GLYPHS.length - 1))];

          context.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.42)`;
          context.fillRect(x * cellWidth, y * cellHeight, cellWidth + 0.5, cellHeight + 0.5);

          context.fillStyle = `rgba(${Math.min(255, red + 54)}, ${Math.min(255, green + 54)}, ${Math.min(255, blue + 54)}, 0.96)`;
          context.fillText(
            glyph,
            (x + 0.5) * cellWidth,
            (y + 0.52) * cellHeight,
          );
        }
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) void video.play().catch(() => undefined);
      else video.pause();
    });
    const resizeObserver = new ResizeObserver(resize);

    observer.observe(canvas);
    resizeObserver.observe(canvas);
    resize();
    void video.play().catch(() => undefined);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [columns, rows, src]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className}
        role="img"
        aria-label={alt}
      />
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop={loop}
        onEnded={onEnded}
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
