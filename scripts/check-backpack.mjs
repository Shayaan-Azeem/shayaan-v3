import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { BACKPACK_ROUTES } from "../app/lib/backpackNavigation.ts";

const build = join(import.meta.dirname, "..", ".next");
const budget = 250_000;
let expectedScripts;

for (const route of Object.keys(BACKPACK_ROUTES)) {
  const page = route === "/" ? "index" : route.slice(1);
  const html = await readFile(join(build, "server", "app", `${page}.html`), "utf8");
  const scripts = [...new Set([...html.matchAll(/<script[^>]+src="([^"?]+)/g)].map((match) => match[1]))].sort();
  assert.ok(scripts.length, `${route} has initial JavaScript`);
  if (!expectedScripts) expectedScripts = scripts;
  assert.deepEqual(scripts, expectedScripts, `${route} must load the same complete backpack on first visit`);
}

let compressedBytes = 0;
for (const script of expectedScripts) {
  assert.ok(script.startsWith("/_next/static/"), `Unexpected initial script: ${script}`);
  const source = await readFile(join(build, script.slice("/_next/".length)));
  compressedBytes += gzipSync(source).length;
}

console.log(`Backpack: ${Object.keys(BACKPACK_ROUTES).length} routes, ${(compressedBytes / 1000).toFixed(1)} KB gzip including framework code (${budget / 1000} KB budget).`);
console.log("All routes share the same initial scripts. Images, videos, fonts, and HTML are measured separately.");
assert.ok(compressedBytes <= budget, `Initial JavaScript exceeds the backpack budget by ${compressedBytes - budget} bytes.`);
