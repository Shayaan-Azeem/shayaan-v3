// Regenerate after changing a video or its effect:
// node --experimental-strip-types scripts/generate-video-posters.mjs [path-to-@napi-rs/canvas]
// Requires ffmpeg and @napi-rs/canvas (only for this authoring step).
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { PROJECTS } from "../app/projects/data.ts";
import { sampleSource, paintAsciiFrame, paintHalftoneFrame } from "../app/components/pixelCanvas.ts";

const require = createRequire(import.meta.url);
const { createCanvas, loadImage } = require(process.argv[2] || "@napi-rs/canvas");
const posters = {};
for (const project of PROJECTS.filter(project => project.video)) {
  const frame = execFileSync("ffmpeg", [
    "-v", "error", "-i", `public${project.video}`, "-frames:v", "1",
    "-vf", "scale=320:-1", "-f", "image2pipe", "-vcodec", "png", "pipe:1",
  ]);
  const source = await loadImage(frame);
  const canvas = createCanvas(source.width, source.height);
  const context = canvas.getContext("2d");
  if (project.videoEffect) {
    const [columns, rows] = project.videoEffect === "ascii" ? [120, 90] : [64, 48];
    const sampler = { context: createCanvas(columns, rows).getContext("2d"), columns, rows };
    const pixels = sampleSource(sampler, source, source.width, source.height, source.width / source.height);
    const paint = project.videoEffect === "ascii" ? paintAsciiFrame : paintHalftoneFrame;
    paint(context, pixels, columns, rows);
    if (project.videoEffect === "halftone") {
      // Match the live canvas's CSS brightness(0.68).
      context.fillStyle = "rgba(0, 0, 0, 0.32)";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    context.drawImage(source, 0, 0);
  }
  const webp = await sharp(canvas.toBuffer("image/png")).webp({ quality: 40 }).toBuffer();
  posters[project.video] = `data:image/webp;base64,${webp.toString("base64")}`;
  console.log(`${project.title}: ${webp.length} bytes`);
}
writeFileSync("app/projects/videoPosters.json", `${JSON.stringify(posters, null, 2)}\n`);
