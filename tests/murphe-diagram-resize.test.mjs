import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../public/murph-e/diagrams/resize.js", import.meta.url), "utf8");
for (const diagram of ["jev-reuse-flow", "prompt-to-game"]) {
  test(`${diagram} remeasures after repeated BFCache restores and stops after final unload`, async () => {
    const html = readFileSync(new URL(`../public/murph-e/diagrams/${diagram}.html`, import.meta.url), "utf8");
    const rootId = html.match(/<script src="\.\/resize\.js" data-root="([^"]+)"/)[1];
    const window = new EventTarget(), frames = new Map(), heights = [];
    let id = 0, height = 200, connected = false, observed;
    const root = { getBoundingClientRect: () => ({ height }) };
    const context = vm.createContext({
      window,
      document: { currentScript: { dataset: { root: rootId } }, getElementById: value => { assert.equal(value, rootId); return root; }, fonts: { ready: Promise.resolve() } },
      parent: { postMessage: message => heights.push(message.height) },
      requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
      cancelAnimationFrame: id => frames.delete(id),
      ResizeObserver: class {
        constructor(callback) { observed = callback; }
        observe(value) { assert.equal(value, root); connected = true; }
        disconnect() { connected = false; }
      },
    });
    const emit = (type, persisted = false) => window.dispatchEvent(Object.assign(new Event(type), { persisted }));
    const paint = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); };
    vm.runInContext(source, context);
    await Promise.resolve();
    paint();
    assert.deepEqual(heights, [200]);
    for (const nextHeight of [350, 180]) {
      emit("pagehide", true);
      assert.equal(connected, false);
      height = nextHeight;
      emit("resize"); observed(); paint();
      assert.equal(frames.size, 0);
      const count = heights.length;
      emit("pageshow", true);
      assert.equal(connected, true);
      paint();
      assert.equal(heights.length, count + 1);
      assert.equal(heights.at(-1), nextHeight);
      height += 20;
      observed(); emit("resize");
      assert.equal(frames.size, 1, "resize sources share a single frame");
      paint();
      assert.equal(heights.at(-1), height);
    }
    const count = heights.length;
    emit("pagehide");
    emit("pageshow", true); emit("resize"); observed(); paint();
    assert.equal(connected, false);
    assert.equal(frames.size, 0);
    assert.equal(heights.length, count);
  });
}
