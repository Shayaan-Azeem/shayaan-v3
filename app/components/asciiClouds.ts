export type CloudMask = { width: number; height: number; coverage: Float32Array };

// Read the supplied cumulus artwork once. White is exterior sky, black is cloud.
export function sampleCloudImage(image: HTMLImageElement): CloudMask | null {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = Math.round(160 * 708 / 1928);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(image, 28, 23, 1928, 708, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const coverage = new Float32Array(canvas.width * canvas.height);
  for (let index = 0; index < coverage.length; index += 1) {
    const offset = index * 4;
    coverage[index] = (1 - (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 765)
      * pixels[offset + 3] / 255;
  }
  return { width: canvas.width, height: canvas.height, coverage };
}

const CLOUDS = [
  { phase: 0.08, top: 0.1, scale: 1, speed: 5.5 },
  { phase: 0.35, top: 0.32, scale: 0.8, speed: 4 },
  { phase: 0.61, top: 0.13, scale: 1.15, speed: 6.5 },
  { phase: 0.88, top: 0.4, scale: 0.9, speed: 4.8 },
];

export function cloudPlacements(columns: number, rows: number, seconds: number, aspect: number, cellAspect = 0.6) {
  return CLOUDS.map((cloud, index) => {
    const width = Math.max(36, Math.min(80, columns * 0.12)) * cloud.scale * 0.7;
    // Account for rectangular text cells so the rounded artwork isn't stretched.
    const height = Math.max(4, Math.round(width * cellAspect / aspect));
    const period = columns + width + 4;
    const initialLeft = cloud.phase * columns - width / 2;
    const left = ((initialLeft + width + seconds * cloud.speed) % period + period) % period - width;
    return { left, top: Math.round(rows * cloud.top), width, height, period, speed: cloud.speed, flip: index % 2 === 1 };
  });
}

// Move the complete rounded silhouette, rather than morphing a diffuse noise
// field. All drawing remains clipped to open sky, above roofs and window panes.
export function renderAsciiClouds(
  columns: number,
  rows: number,
  sky: Uint8Array,
  seconds: number,
  mask: CloudMask | null,
  cellAspect = 0.6,
) {
  if (columns < 1 || rows < 1) return "";
  const cells = Array<string>(columns * rows).fill(" ");
  if (mask) {
    for (const cloud of cloudPlacements(columns, rows, seconds, mask.width / mask.height, cellAspect)) {
      for (let row = cloud.top; row < Math.min(rows, cloud.top + cloud.height); row += 1) {
        const sourceY = Math.min(mask.height - 1, Math.floor((row - cloud.top + 0.5) / cloud.height * mask.height));
        for (let column = Math.max(0, Math.floor(cloud.left)); column < Math.min(columns, Math.ceil(cloud.left + cloud.width)); column += 1) {
          const index = row * columns + column;
          if (!sky[index]) continue;
          const localX = (column - cloud.left + 0.5) / cloud.width;
          if (localX < 0 || localX >= 1) continue;
          const sourceX = Math.min(mask.width - 1, Math.floor((cloud.flip ? 1 - localX : localX) * mask.width));
          const ink = mask.coverage[sourceY * mask.width + sourceX];
          if (ink < 0.15) continue;
          const above = sourceY > 0 ? mask.coverage[(sourceY - 1) * mask.width + sourceX] : 0;
          // Clear rounded contour, with a quieter fill than the buildings.
          cells[index] = ink < 0.5 ? "1" : above < 0.5 ? "0" : row - cloud.top < cloud.height * 0.6 ? "1" : "0";
        }
      }
    }
  }
  const lines = [];
  for (let row = 0; row < rows; row += 1) lines.push(cells.slice(row * columns, (row + 1) * columns).join(""));
  return lines.join("\n");
}
