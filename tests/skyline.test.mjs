import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSkylineImages, sampleSkyline, traceFacadeRoofline } from "../app/components/skylineMask.ts";

function mockGlobal(t, name, value) {
  const original = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, name, original);
    else delete globalThis[name];
  });
}

test("temporarily hidden footers do not attempt a zero-size canvas read", () => {
  for (const dimensions of [[0, 110, 0, 28], [390, 0, 130, 0], [390, 110, 0, 28]]) {
    let landmarks;
    assert.equal(sampleSkyline({}, ...dimensions, (value) => { landmarks = value; }).length, 0);
    assert.deepEqual(landmarks, [], "a hidden footer has no stale interactive targets");
  }
});

test("city clusters fill the center and surround the NYC tower at desktop and phone widths", (t) => {
  const draws = [];
  const context = {
    scale() {}, save() {}, restore() {}, beginPath() {}, rect() {}, clip() {}, translate() {},
    moveTo() {}, lineTo() {}, closePath() {},
    drawImage(...args) { draws.push(args); },
    getImageData(_x, _y, width, height) {
      return { data: new Uint8ClampedArray(width * height * 4) };
    },
  };
  mockGlobal(t, "document", {
    createElement: () => ({ getContext: () => context }),
  });
  const images = Object.fromEntries(
    ["newYork", "toronto", "minar", "mosque", "neighborhood"].map(
      (name) => [name, { name, naturalWidth: 1200, naturalHeight: 1000 }],
    ),
  );

  for (const [width, height] of [[1440, 300], [390, 110]]) {
    draws.length = 0;
    const columns = Math.ceil(width / 2);
    const rows = Math.ceil(height / 4);
    assert.equal(sampleSkyline(images, width, height, columns, rows).length, columns * rows);
    const [nyc] = draws;
    assert.equal(nyc[0], images.newYork);
    assert.deepEqual(nyc.slice(1, 5), [500, 0, 1200, 655.917]);
    assert.ok(nyc[7] > width * 0.35, "NYC includes neighboring blocks, not just a tower");
    const towerX = nyc[5] + (941 - nyc[1]) / nyc[3] * nyc[7];
    assert.ok(Math.abs(towerX - width * 0.17) < 0.001, "NYC tower is shifted farther left");
    const foregroundTower = draws.find(([image, sourceX]) => image === images.newYork && sourceX === 895);
    assert.ok(Math.abs(foregroundTower[5] + foregroundTower[7] / 2 - towerX) < 0.001,
      "foreground tower stays aligned with its surrounding skyline");

    const middle = draws.filter(([image, sourceX]) => image === images.toronto && sourceX !== 570);
    assert.equal(middle.length, 4, "middle uses separate flat groups, not one dense strip");
    const heights = middle.map((draw) => draw[8]);
    const widths = middle.map((draw) => draw[7]);
    assert.ok(Math.max(...heights) / Math.min(...heights) > 1.45, "varied central roof heights");
    assert.ok(Math.max(...widths) / Math.min(...widths) > 1.4, "varied building widths");
    middle.forEach((draw, index) => {
      assert.ok(draw[5] >= width * 0.34 && draw[5] + draw[7] <= width * 0.68);
      if (index > 0) {
        const previous = middle[index - 1];
        assert.ok(draw[5] - (previous[5] + previous[7]) >= width * 0.006,
          "central groups retain breathing room, including at phone widths");
      }
    });
    const labelAdjacentBuilding = middle.find((draw) => draw[1] === 1620);
    assert.ok(labelAdjacentBuilding[8] <= height * 0.48 + 0.001,
      "roof stays below the overlapping project label rather than getting cut off");
    for (const draw of [nyc, ...middle]) {
      assert.ok(Math.abs(draw[7] / draw[8] - draw[3] / draw[4]) < 0.001);
      assert.ok(Math.abs(draw[6] + draw[8] - height) < 0.001, "shared baseline");
    }
    assert.ok(draws.findIndex(([image]) => image === images.neighborhood) > 4,
      "street-level facade detail sits in front of the city clusters");

    const mosque = draws.find(([image]) => image === images.mosque);
    assert.ok(Math.abs(mosque[7] - width * 0.32) < 0.001, "mosque is 28% larger than the original quarter-width size");
    assert.ok(mosque[5] >= 0 && mosque[5] + mosque[7] <= width * 0.99 + 0.001,
      "both minarets remain within the footer");
    assert.ok(Math.abs(mosque[7] / mosque[8] - 2560 / 707) < 0.001, "mosque proportions stay natural");
    assert.ok(Math.abs(mosque[6] + mosque[8] - height) < 0.001, "mosque stays on the skyline baseline");

    const brickEntrance = { naturalWidth: 1632, naturalHeight: 964 };
    draws.length = 0;
    sampleSkyline({ ...images, brickEntrance }, width, height, columns, rows);
    const facade = draws.findLast(([image]) => image === brickEntrance);
    const remainingMiddle = draws.filter(([image, sourceX]) => image === images.toronto && sourceX !== 570);
    assert.equal(remainingMiddle.length, 4, "central groups fill the space vacated by the apartment");
    assert.ok(facade[5] >= 0 && facade[5] + facade[7] <= width * 0.225, "apartment stays in the NYC section");
    assert.ok(facade[8] <= height * 0.44 + 0.001, "entrance roof clears the project labels");
    assert.ok(facade[7] <= width * 0.16 + 0.001, "frontage keeps its existing scale");
    assert.deepEqual(facade.slice(1, 5), [25, 34, 1581, 884], "exterior padding is excluded");
    assert.ok(Math.abs(facade[7] / facade[8] - 1581 / 884) < 0.001, "flat facade retains its proportions");
    assert.ok(Math.abs(facade[6] + facade[8] - height) < 0.001, "doors meet the shared street baseline");
    assert.ok(draws.lastIndexOf(facade) > draws.findLastIndex(([image]) => image === images.neighborhood),
      "street-level row cannot obscure the arched front door");

    const oneWorld = { naturalWidth: 51, naturalHeight: 302 };
    const waterlooE7 = { naturalWidth: 1000, naturalHeight: 660 };
    draws.length = 0;
    let landmarks;
    sampleSkyline({ ...images, brickEntrance, oneWorld, waterlooE7 }, width, height, columns, rows, (value) => { landmarks = value; });
    const tradeCenter = draws.find(([image]) => image === oneWorld);
    const empireState = draws.find(([image, sourceX]) => image === images.newYork && sourceX === 895);
    assert.ok(tradeCenter && empireState, "both named NYC towers are rendered together");
    assert.ok(Math.abs(tradeCenter[5] + tradeCenter[7] / 2 - width * 0.095) < 0.001);
    assert.ok(Math.abs(empireState[5] + empireState[7] / 2 - width * 0.17) < 0.001);
    assert.ok(tradeCenter[5] + tradeCenter[7] < empireState[5], "the two tower silhouettes stay separate");
    assert.ok(tradeCenter[6] >= 8 - 0.001, "One World's spire stays inside the footer");
    assert.ok(Math.abs(tradeCenter[6] + tradeCenter[8] - height) < 0.001);
    assert.ok(Math.abs(tradeCenter[7] / tradeCenter[8] - 51 / 302) < 0.001,
      "One World retains the source's taper and proportions");

    const apartment = draws.findLast(([image]) => image === brickEntrance);
    for (const tower of [tradeCenter, empireState]) {
      const center = tower[5] + tower[7] / 2;
      assert.ok(apartment[5] < center && apartment[5] + apartment[7] > center,
        "apartment frontage sits below both NYC towers");
      assert.ok(apartment[6] > tower[6], "tower crowns remain above the apartment roof");
      assert.ok(draws.indexOf(apartment) > draws.indexOf(tower),
        "apartment is drawn in front of the towers");
    }

    const e7 = draws.find(([image]) => image === waterlooE7);
    assert.ok(Math.abs(e7[5] + e7[7] / 2 - width / 2) < 0.001, "E7 occupies the former apartment location");
    assert.ok(e7[8] <= height * 0.44 + 0.001, "E7 roof clears the project labels");
    assert.ok(Math.abs(e7[7] / e7[8] - 1000 / 660) < 0.001, "E7 retains its front-elevation proportions");
    assert.ok(Math.abs(e7[6] + e7[8] - height) < 0.001, "E7 entrance meets the street");
    assert.equal(draws.filter(([image, x]) => image === images.toronto && x !== 570).length, 2,
      "E7 replaces the two central filler buildings");
    assert.ok(draws.indexOf(e7) > draws.findLastIndex(([image]) => image === images.neighborhood),
      "the street layer cannot cover E7's entrance");

    const captionTargets = [
      ["apartment", "nyc", draws.findLast(([image]) => image === brickEntrance)],
      ["one-world", "nyc", tradeCenter],
      ["empire-state", "nyc", empireState],
      ["cn-tower", "toronto", draws.find(([image, x]) => image === images.toronto && x === 570)],
      ["minar", "lahore", draws.find(([image]) => image === images.minar)],
      ["mosque", "lahore", draws.find(([image]) => image === images.mosque)],
      ["waterloo-e7", "waterloo", e7],
    ];
    assert.equal(landmarks.length, 7);
    for (const [id, place, draw] of captionTargets) {
      const target = landmarks.find((landmark) => landmark.id === id);
      assert.equal(target.place, place);
      assert.ok(target.name.length > 0, "each landmark has a keyboard/screen-reader label");
      assert.deepEqual([target.left, target.top, target.width, target.height], draw.slice(5),
        `${id} hover target follows the actual artwork at ${width}px`);
    }
  }
});

test("foreground clipping excludes white sky but retains white windows below each roof", () => {
  // A synthetic foreground with varied roofs, white windows, and an empty lot.
  const rows = [".....", "..#..", ".###.", ".#.#.", "####.", "#..#."];
  const width = rows[0].length;
  const height = rows.length;
  const pixels = new Uint8ClampedArray(width * height * 4).fill(255);
  rows.forEach((row, y) => [...row].forEach((pixel, x) => {
    if (pixel === "#") pixels.fill(0, (y * width + x) * 4, (y * width + x) * 4 + 3);
  }));
  const original = pixels.slice();
  const roofline = traceFacadeRoofline(pixels, width, height);
  const insideFacade = (x, y) => (y + 0.5) / height >= roofline[x];
  assert.equal(insideFacade(1, 1), false, "sky does not erase the background skyline");
  assert.equal(insideFacade(2, 0), false, "no rectangular white strip above roofs");
  assert.equal(insideFacade(2, 1), true, "highest roof is preserved");
  assert.equal(insideFacade(2, 3), true, "white window still hides the buildings behind");
  assert.equal(insideFacade(4, 5), false, "open sky remains open all the way down");
  assert.deepEqual(pixels, original, "source artwork is not modified");
});

test("CN Tower crop excludes its attached neighboring roof without clipping other landmarks", (t) => {
  const draws = [];
  const stack = [];
  let path = [];
  let activeClip = null;
  const context = {
    scale() {},
    save() { stack.push(activeClip); },
    restore() { activeClip = stack.pop(); },
    beginPath() { path = []; },
    rect(x, y, width, height) { path.push([x, y], [x + width, y], [x + width, y + height], [x, y + height]); },
    moveTo(x, y) { path.push([x, y]); },
    lineTo(x, y) { path.push([x, y]); },
    closePath() {},
    clip() { activeClip = path.slice(); },
    drawImage(...args) { draws.push({ args, clip: activeClip }); },
    getImageData(_x, _y, width, height) {
      return { data: new Uint8ClampedArray(width * height * 4) };
    },
  };
  mockGlobal(t, "document", { createElement: () => ({ getContext: () => context }) });
  const images = Object.fromEntries(["newYork", "toronto", "minar", "mosque"].map(
    (name) => [name, { naturalWidth: 1200, naturalHeight: 1000 }],
  ));
  for (const [width, height] of [[1440, 300], [390, 110]]) {
    draws.length = 0;
    sampleSkyline(images, width, height, Math.ceil(width / 2), Math.ceil(height / 4));
    const tower = draws.find(({ args }) => args[0] === images.toronto && args[1] === 570);
    const scale = tower.args[8] / 990;
    const sourceClip = tower.clip.map(([x, y]) => [
      Math.round((570 + (x - tower.args[5]) / scale) * 100) / 100,
      Math.round((y - tower.args[6]) / scale * 100) / 100,
    ]);
    assert.deepEqual(sourceClip, [
      [570, 0], [685, 0], [685, 755.47], [651.75, 755.47], [659.04, 990], [570, 990],
    ], "retain the full crown, then exclude the block to the right of the tapered shaft");
    const nycBackground = draws.find(({ args }) => args[0] === images.newYork && args[1] === 500);
    const nycRight = Math.max(...nycBackground.clip.map(([x]) => x));
    assert.ok(nycRight < tower.args[5],
      "NYC background buildings cannot fill the negative space around the CN Tower");
    assert.ok(draws.filter((draw) => draw !== tower && draw !== nycBackground).every(({ clip }) => clip === null),
      "other landmark silhouettes are not clipped");
    assert.ok(Math.abs(tower.args[5] + tower.args[7] / 2 - width * 0.27) < 0.001,
      "the tower stays in its existing position");
  }
});

test("E7 replaces the old Waterloo asset and SoHo is no longer loaded", async (t) => {
  const requests = [];
  mockGlobal(t, "Image", class {
    set src(value) {
      requests.push(value);
      queueMicrotask(() => this.onload());
    }
  });
  const images = await loadSkylineImages();
  assert.equal("waterloo" in images, false);
  assert.equal("soho" in images, false);
  assert.ok(images.waterlooE7);
  assert.equal(requests.length, 9);
  assert.ok(requests.includes("/skyline/brick-entrance.webp"));
  assert.ok(requests.includes("/skyline/one-world-trade-center.svg"));
  assert.ok(requests.includes("/skyline/cumulus-cloud.webp"));
  assert.ok(requests.includes("/skyline/waterloo-e7.svg"));
  assert.equal(requests.some((src) => src.includes("waterloo-atrium") || src.includes("soho")), false);
});
