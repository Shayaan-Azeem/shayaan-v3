import assert from "node:assert/strict";
import { test } from "node:test";
import { createCloudSkyMask } from "../app/components/asciiSkyline.ts";
import { cloudPlacements, renderAsciiClouds } from "../app/components/asciiClouds.ts";

// An opaque sampler fixture isolates compositing and movement from asset loading.
const mask = { width: 20, height: 8, coverage: new Float32Array(160).fill(1) };

test("cloud sky mask hides roofs and all the windows beneath them", () => {
  const columns = 5;
  const rows = 8;
  const coverage = new Float32Array(columns * rows);
  coverage[2 * columns + 1] = 1;
  coverage[4 * columns + 3] = 0.1;
  const sky = createCloudSkyMask(columns, rows, coverage);
  for (let row = 0; row < rows; row += 1) {
    assert.equal(sky[row * columns], 1, "empty sky remains open");
    assert.equal(sky[row * columns + 1], Number(row < 2));
    assert.equal(sky[row * columns + 3], Number(row < 4));
  }
});

test("cloud shapes move horizontally without bobbing, morphing, or changing the frame size", () => {
  const columns = 600;
  const rows = 75;
  const sky = new Uint8Array(columns * rows).fill(1);
  const start = renderAsciiClouds(columns, rows, sky, 0, mask).split("\n");
  const later = renderAsciiClouds(columns, rows, sky, 1, mask).split("\n");
  assert.equal(start.length, rows);
  assert.ok(start.every(line => line.length === columns));
  assert.notDeepEqual(start, later);
  const positions = cloudPlacements(columns, rows, 0, 2.5);
  const moved = cloudPlacements(columns, rows, 1, 2.5);
  positions.forEach((cloud, index) => {
    assert.ok(cloud.width < 60, "clouds keep the smaller footprint at desktop widths");
    assert.equal(moved[index].top, cloud.top, "no vertical bobbing");
    assert.equal(moved[index].width, cloud.width);
    assert.equal(moved[index].height, cloud.height, "rounded silhouette doesn't morph");
    assert.ok(Math.abs(moved[index].left - cloud.left - cloud.speed) < 0.001);
    assert.ok(cloud.speed >= 4, "horizontal movement is noticeable within one second");
    const wrapped = cloudPlacements(columns, rows, cloud.period / cloud.speed, 2.5)[index];
    assert.ok(Math.abs(wrapped.left - cloud.left) < 0.001, "clouds loop seamlessly offscreen");
  });
  assert.equal(renderAsciiClouds(columns, rows, sky, 0, mask), start.join("\n"),
    "a paused clock produces an identical frame for reduced-motion users");
});

test("clouds stay above the horizon and never draw through blocked facade cells", () => {
  for (const [columns, rows] of [[600, 75], [216, 37]]) {
    const sky = new Uint8Array(columns * rows).fill(1);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 20; column < 30; column += 1) sky[row * columns + column] = 0;
    }
    for (const time of [0, 5, 100]) {
      const lines = renderAsciiClouds(columns, rows, sky, time, mask).split("\n");
      assert.ok(lines.join("").trim().length > 0, "clouds remain visible at desktop and mobile widths");
      for (let row = 0; row < rows; row += 1) {
        assert.equal(lines[row].slice(20, 30), " ".repeat(10));
        if (row / rows >= 0.7 || row / rows <= 0.07) assert.equal(lines[row].trim(), "");
      }
    }
  }
});

test("the bitmap silhouette, not noise, determines which cells are cloud", () => {
  const sky = new Uint8Array(200 * 40).fill(1);
  const blankMask = { ...mask, coverage: new Float32Array(mask.coverage.length) };
  assert.equal(renderAsciiClouds(200, 40, sky, 0, blankMask).trim(), "");
  assert.equal(renderAsciiClouds(200, 40, sky, 0, null).trim(), "");
  assert.ok(renderAsciiClouds(200, 40, sky, 0, mask).trim().length > 0);
});
