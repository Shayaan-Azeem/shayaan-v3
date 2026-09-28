import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import { clamp, separation } from "../public/murph-e/model/motion.js";

// Exercise the viewer's actual event handlers with GPU resources replaced by spies.
const source = readFileSync(new URL("../public/murph-e/model/viewer.js", import.meta.url), "utf8")
  .replace(/^import .*;\n/gm, "").split("\ntry {")[0];

function viewer() {
  class Events extends EventTarget {
    emit(type, properties = {}) { this.dispatchEvent(Object.assign(new Event(type), properties)); }
  }
  const window = new Events(), document = new Events(), motion = new Events();
  document.hidden = false; document.body = { dataset: {} }; motion.matches = false;
  const messages = [];
  const parent = { postMessage: message => messages.push(message) }, origin = "https://portfolio.test";
  let id = 0, paints = 0;
  const frames = new Map(), disposed = [];
  const texture = { isTexture: true, source: { data: { close: () => disposed.push("bitmap") } }, dispose: () => disposed.push("texture") };
  const material = { map: texture, uniforms: { picture: { value: texture }, time: { value: 0 } }, dispose: () => disposed.push("material") };
  const geometry = { dispose: () => disposed.push("geometry") };
  class Vector { constructor(x = 0, y = 0, z = 0) { Object.assign(this, { x, y, z }); } set() {} applyMatrix4() { return this; } }
  const context = vm.createContext({
    window, document, parent, materialSpy: material, location: { origin }, clamp, separation,
    projectedCenter: () => ({ x: 0, y: 0 }),
    matchMedia: () => motion, performance: { now: () => 100 }, innerWidth: 900, innerHeight: 450,
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    THREE: {
      Scene: class { traverse(callback) { callback({ geometry, material }); } },
      OrthographicCamera: class { position = new Vector(); lookAt() {} updateMatrixWorld() {} updateProjectionMatrix() {} },
      Vector3: Vector, Vector2: Vector,
    },
    rendererSpy: {
      getSize: () => ({ x: 900, y: 450 }), render: () => paints++,
      dispose: () => disposed.push("renderer"), forceContextLoss: () => disposed.push("context"),
    },
  });
  vm.runInContext(source, context);
  vm.runInContext("renderer = rendererSpy; model = {}; manifest = { bounds: { min: [-1, -1, -1], max: [1, 1, 1] } }; crt = materialSpy; ready = true;", context);
  return {
    window, document, disposed, messages,
    init() { window.emit("message", { source: parent, origin, data: { type: "murphe-init" } }); },
    get frames() { return frames.size; }, get paints() { return paints; },
    progress(value) { window.emit("message", { source: parent, origin, data: { type: "murphe-progress", progress: value, visible: true } }); },
    paint() { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(100)); },
  };
}

test("BFCache hides pause the viewer and repeated restores resume rendering without disposing resources", () => {
  const page = viewer();
  page.progress(0.25); page.paint();
  assert.equal(page.document.body.dataset.progress, "0.250");
  for (const progress of [0.5, 0.75]) {
    const paints = page.paints;
    page.window.emit("pagehide", { persisted: true });
    assert.equal(page.frames, 0);
    assert.deepEqual(page.disposed, []);
    page.document.emit("visibilitychange");
    page.progress(progress);
    assert.equal(page.frames, 0, "visibility and parent messages cannot restart a suspended viewer");
    page.window.emit("pageshow", { persisted: true });
    assert.ok(page.frames > 0);
    page.paint();
    assert.ok(page.paints > paints);
    assert.equal(page.document.body.dataset.progress, progress.toFixed(3));
  }
  assert.deepEqual(page.disposed, []);
  page.window.emit("pagehide", { persisted: false });
  assert.deepEqual(page.disposed, ["bitmap", "texture", "material", "geometry", "renderer", "context"]);
  assert.equal(page.frames, 0);
});

test("a final unload releases resources once and later events cannot restart the viewer", () => {
  const page = viewer();
  page.progress(0.4);
  page.window.emit("pagehide", { persisted: false });
  const released = [...page.disposed];
  assert.equal(released.length, 6);
  page.window.emit("pagehide", { persisted: false });
  page.window.emit("pageshow", { persisted: true });
  page.window.emit("resize");
  page.document.emit("visibilitychange");
  page.progress(0.8);
  assert.deepEqual(page.disposed, released);
  assert.equal(page.frames, 0);
});


test("a parent that hydrates after the viewer is ready can recover the ready message without a progress loop", () => {
  const page = viewer();
  page.init();
  assert.deepEqual(page.messages.map(message => message.type), ["murphe-ready"]);
  page.progress(0.4);
  assert.equal(page.messages.length, 1, "ordinary progress updates must not reply and trigger another update");
  page.window.emit("pagehide", { persisted: false });
  page.init();
  assert.equal(page.messages.length, 1, "disposed viewers cannot report ready");
});
