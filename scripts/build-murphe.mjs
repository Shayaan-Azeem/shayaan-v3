import { build, context } from "esbuild";
import { fileURLToPath } from "node:url";

// Keep the iframe self-contained without committing the Three.js distribution.
const options = {
  absWorkingDir: fileURLToPath(new URL("..", import.meta.url)),
  entryPoints: ["public/murph-e/model/viewer.js"],
  outfile: "public/murph-e/model/viewer.bundle.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  minify: true,
  legalComments: "eof",
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const builder = await context(options);
  await builder.watch();
} else {
  await build(options);
}
