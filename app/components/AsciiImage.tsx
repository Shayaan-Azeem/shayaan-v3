"use client";

import { useEffect, useRef } from "react";

const GLYPHS = " .,:;irsXA253hMHGS#9B&@";

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
    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!context || !sampleContext) return;

    const columns = 120;
    const rows = 90;
    sampleCanvas.width = columns;
    sampleCanvas.height = rows;

    const source = new window.Image();

    const draw = () => {
      if (!source.complete || source.naturalWidth === 0) return;

      const rect = canvas.getBoundingClientRect();
      const density = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * density));
      canvas.height = Math.max(1, Math.round(rect.height * density));

      const sourceRatio = source.naturalWidth / source.naturalHeight;
      const targetRatio = columns / rows;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = source.naturalWidth;
      let sourceHeight = source.naturalHeight;

      if (sourceRatio > targetRatio) {
        sourceWidth = source.naturalHeight * targetRatio;
        sourceX = (source.naturalWidth - sourceWidth) / 2;
      } else {
        sourceHeight = source.naturalWidth / targetRatio;
        sourceY = (source.naturalHeight - sourceHeight) / 2;
      }

      sampleContext.drawImage(
        source,
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

    source.addEventListener("load", draw);
    source.src = src;
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);

    return () => {
      source.removeEventListener("load", draw);
      resizeObserver.disconnect();
    };
  }, [src]);

  return <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />;
}
