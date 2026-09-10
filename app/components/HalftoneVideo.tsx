"use client";

import { useEffect, useRef } from "react";

export default function HalftoneVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
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

    const columns = 64;
    const rows = 48;
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

      if (!isVisible || video.readyState < 2 || time - lastFrame < 33) return;
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
      const maxRadius = Math.min(cellWidth, cellHeight) * 0.43;

      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#f4f4f2";

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          const offset = (y * columns + x) * 4;
          const brightness =
            pixels[offset] * 0.2126 +
            pixels[offset + 1] * 0.7152 +
            pixels[offset + 2] * 0.0722;
          const radius = Math.pow(brightness / 255, 1.35) * maxRadius;

          if (radius < 0.35) continue;

          context.beginPath();
          context.arc(
            (x + 0.5) * cellWidth,
            (y + 0.5) * cellHeight,
            radius,
            0,
            Math.PI * 2,
          );
          context.fill();
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
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className}
        role="img"
        aria-label="General Learning montage rendered as a field of dots"
      />
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
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
