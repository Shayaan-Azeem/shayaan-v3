import assert from "node:assert/strict";
import { test } from "node:test";
import { createSkylineCaptionController, positionSkylineCaption, SKYLINE_CAPTIONS, SKYLINE_SONGS } from "../app/components/skylineCaptionPosition.ts";

test("skyline captions show only city and country", () => {
  assert.deepEqual(SKYLINE_CAPTIONS, {
    lahore: "Lahore, Pakistan",
    toronto: "Toronto, Canada",
    nyc: "New York, USA",
    waterloo: "Waterloo, Canada",
  });
});

test("cities retain their verified tracks while Waterloo has a caption without a song", () => {
  assert.deepEqual(Object.keys(SKYLINE_SONGS), Object.keys(SKYLINE_CAPTIONS));
  assert.equal(SKYLINE_SONGS.waterloo, null);
  assert.deepEqual(Object.values(SKYLINE_SONGS).filter(Boolean).map(({ title, href }) => [title, href]), [
    ["Longing", "https://open.spotify.com/track/2IVTadJg1X3ZjlHI5dLh9r"],
    ["Know Yourself", "https://open.spotify.com/track/1d9AWpbn0IF95ZlgsfqAKE"],
    ["Theme From New York, New York", "https://open.spotify.com/track/5EIXjYOsrrqf2VYmL9GReV"],
  ]);
});

test("replacement cursor is centered on the pointer without positioning lag", () => {
  assert.deepEqual(positionSkylineCaption(600, 500, 280, 68, 1440, 900), { x: 460, y: 466 });
  assert.deepEqual(positionSkylineCaption(605, 503, 280, 68, 1440, 900), { x: 465, y: 469 });
});

test("captions stay inside all viewport edges, including mobile tap targets", () => {
  for (const [viewportWidth, viewportHeight] of [[1440, 900], [390, 844], [240, 600]]) {
    const width = Math.min(280, viewportWidth - 24);
    const height = 86;
    for (const [x, y] of [[0, 0], [viewportWidth, 0], [0, viewportHeight], [viewportWidth, viewportHeight], [-100, -100]]) {
      const position = positionSkylineCaption(x, y, width, height, viewportWidth, viewportHeight);
      assert.ok(position.x >= 12 && position.y >= 12);
      assert.ok(position.x + width <= viewportWidth - 12);
      assert.ok(position.y + height <= viewportHeight - 12);
    }
  }
});

function captionHarness() {
  const stats = { measurements: 0, viewportReads: 0, textWrites: 0, visibleStates: [] };
  let text = "";
  const caption = {
    style: {},
    dataset: new Proxy({}, { set(target, key, value) {
      if (key === "visible") stats.visibleStates.push(value);
      target[key] = value;
      return true;
    } }),
    get offsetWidth() { stats.measurements++; return 140; },
    get offsetHeight() { stats.measurements++; return 32; },
  };
  const label = {
    get textContent() { return text; },
    set textContent(value) { stats.textWrites++; text = value; },
  };
  const viewport = { width: 1440, height: 900 };
  const controller = createSkylineCaptionController(caption, label, () => {
    stats.viewportReads++;
    return { ...viewport };
  });
  return { stats, caption, label, viewport, controller };
}

test("1000 pointer moves perform no additional measurements or text updates", () => {
  const { controller, caption, stats } = captionHarness();
  controller.show("lahore", 500, 500);
  for (let index = 0; index < 1000; index++) controller.move(500 + index % 100, 500);
  assert.equal(stats.measurements, 2, "measure width and height once, not per move");
  assert.equal(stats.textWrites, 1);
  assert.equal(stats.viewportReads, 1);
  assert.equal(caption.style.transform, "translate3d(529px, 484px, 0)");
  assert.deepEqual(stats.visibleStates, ["true"], "tracking never hides or remounts the caption");
});

test("switching landmarks keeps the label visible and only measures changed city text", () => {
  const { controller, caption, label, stats } = captionHarness();
  controller.show("lahore", 500, 500);
  controller.show("lahore", 600, 500); // Minar to mosque.
  assert.equal(stats.measurements, 2);
  assert.equal(stats.textWrites, 1);
  controller.show("nyc", 200, 500);
  assert.equal(label.textContent, "New York, USA");
  assert.equal(stats.measurements, 4);
  assert.equal(caption.dataset.visible, "true");
  assert.ok(stats.visibleStates.every((state) => state === "true"), "no intermediate hide/fade");
});

test("dismissal is immediate and resize/font changes invalidate cached dimensions", () => {
  const { controller, caption, viewport, stats } = captionHarness();
  controller.show("toronto", 500, 500);
  controller.hide();
  const position = caption.style.transform;
  controller.move(700, 700);
  assert.equal(caption.dataset.visible, "false");
  assert.equal(caption.style.transform, position, "hidden captions do no movement work");
  viewport.width = 390;
  viewport.height = 844;
  controller.invalidate();
  controller.show("toronto", 390, 844);
  assert.equal(stats.measurements, 4);
  assert.equal(caption.style.transform, "translate3d(238px, 800px, 0)");
  assert.equal(caption.dataset.visible, "true");
});
