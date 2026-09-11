import { useEffect, type CSSProperties, type RefObject } from "react";

export const HIDDEN_VIDEO_STYLE: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: "none",
};

type Sampler = {
  context: CanvasRenderingContext2D;
  columns: number;
  rows: number;
};

/** Matches the canvas backing store to its displayed size, capped at 2x density. */
export function resizeToDisplaySize(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const density = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * density));
  canvas.height = Math.max(1, Math.round(rect.height * density));
}

export function createSampler(columns: number, rows: number): Sampler | null {
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  return context ? { context, columns, rows } : null;
}

/** Center-crops to the displayed frame; the sampling grid only sets detail. */
export function sampleSource(
  sampler: Sampler,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetRatio: number,
) {
  const { context, columns, rows } = sampler;
  const sourceRatio = sourceWidth / sourceHeight;
  let x = 0;
  let y = 0;
  let width = sourceWidth;
  let height = sourceHeight;

  if (sourceRatio > targetRatio) {
    width = sourceHeight * targetRatio;
    x = (sourceWidth - width) / 2;
  } else {
    height = sourceWidth / targetRatio;
    y = (sourceHeight - height) / 2;
  }

  context.drawImage(source, x, y, width, height, 0, 0, columns, rows);

  return context.getImageData(0, 0, columns, rows).data;
}

export function brightnessAt(pixels: Uint8ClampedArray, offset: number) {
  return (
    pixels[offset] * 0.2126 +
    pixels[offset + 1] * 0.7152 +
    pixels[offset + 2] * 0.0722
  );
}

const GLYPHS = " .,:;irsXA253hMHGS#9B&@";

export function paintAsciiFrame(
  context: CanvasRenderingContext2D,
  pixels: Uint8ClampedArray,
  columns: number,
  rows: number,
) {
  const { canvas } = context;
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
      const glyph =
        GLYPHS[
          Math.round((brightnessAt(pixels, offset) / 255) * (GLYPHS.length - 1))
        ];

      context.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.42)`;
      context.fillRect(
        x * cellWidth,
        y * cellHeight,
        cellWidth + 0.5,
        cellHeight + 0.5,
      );

      context.fillStyle = `rgba(${Math.min(255, red + 54)}, ${Math.min(255, green + 54)}, ${Math.min(255, blue + 54)}, 0.96)`;
      context.fillText(glyph, (x + 0.5) * cellWidth, (y + 0.52) * cellHeight);
    }
  }
}

export function paintHalftoneFrame(
  context: CanvasRenderingContext2D,
  pixels: Uint8ClampedArray,
  columns: number,
  rows: number,
) {
  const { canvas } = context;
  const cellWidth = canvas.width / columns;
  const cellHeight = canvas.height / rows;
  const maxRadius = Math.min(cellWidth, cellHeight) * 0.43;

  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f4f4f2";

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const offset = (y * columns + x) * 4;
      const radius =
        Math.pow(brightnessAt(pixels, offset) / 255, 1.35) * maxRadius;

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
}

/**
 * Paint only changing, visible video frames. Playback is owned separately so
 * toggling pause does not clear the canvas or recreate its sampling buffers.
 */
export function useSampledVideo({
  canvasRef,
  videoRef,
  columns,
  rows,
  frameInterval,
  paint,
  src,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  columns: number;
  rows: number;
  frameInterval: number;
  paint: (
    context: CanvasRenderingContext2D,
    pixels: Uint8ClampedArray,
    columns: number,
    rows: number,
  ) => void;
  src: string;
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const context = canvas.getContext("2d");
    const sampler = createSampler(columns, rows);
    if (!context || !sampler) return;

    let animationFrame: number | null = null;
    let lastFrame = -Infinity;
    let lastVideoTime = -1;
    let isVisible = false;

    const paintFrame = (force = false) => {
      if (!isVisible || document.hidden || video.readyState < 2) return;
      if (!force && lastVideoTime === video.currentTime) return;
      const pixels = sampleSource(
        sampler,
        video,
        video.videoWidth,
        video.videoHeight,
        canvas.width / canvas.height,
      );
      paint(context, pixels, columns, rows);
      lastVideoTime = video.currentTime;
      canvas.style.opacity = "1";
    };

    const stop = () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
    };

    const draw = (time: number) => {
      animationFrame = null;
      if (!isVisible || document.hidden || video.paused) return;
      if (time - lastFrame >= frameInterval) {
        paintFrame();
        lastFrame = time;
      }
      animationFrame = requestAnimationFrame(draw);
    };

    const sync = () => {
      stop();
      paintFrame(true);
      if (isVisible && !document.hidden && !video.paused) {
        animationFrame = requestAnimationFrame(draw);
      }
    };
    const resize = () => {
      resizeToDisplaySize(canvas);
      paintFrame(true);
    };
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      sync();
    });
    const resizeObserver = new ResizeObserver(resize);

    for (const event of ["loadeddata", "seeked", "playing", "pause"]) video.addEventListener(event, sync);
    document.addEventListener("visibilitychange", sync);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    resize();

    return () => {
      stop();
      for (const event of ["loadeddata", "seeked", "playing", "pause"]) video.removeEventListener(event, sync);
      document.removeEventListener("visibilitychange", sync);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [canvasRef, videoRef, columns, rows, frameInterval, paint, src]);
}
