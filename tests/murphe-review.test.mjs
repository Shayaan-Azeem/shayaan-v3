import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import * as navigation from "../app/lib/backpackNavigation.ts";

const html = readFileSync(new URL("../public/murph-e/diagrams/prompt-to-game.html", import.meta.url), "utf8");
const playback = html.slice(html.indexOf("let started=false,frame="), html.indexOf("\n})();", html.indexOf("let started=false,frame=")));
function game({ reduced = false } = {}) {
  let now = 0, id = 0, steps = 0, intersect;
  const frames = new Map(), listeners = new Map();
  const document = { hidden: false, addEventListener: (name, callback) => listeners.set(name, callback) };
  vm.runInNewContext(playback, {
    document, root: {}, performance: { now: () => now },
    runtime: { step: (count) => { steps += count; } }, paint() {},
    matchMedia: () => ({ matches: reduced }),
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: class { constructor(callback) { intersect = callback; } observe() {} },
  });
  return {
    get frames() { return frames.size; }, get steps() { return steps; },
    enter() { intersect([{ isIntersecting: true }]); },
    hide(hidden) { document.hidden = hidden; listeners.get("visibilitychange")(); },
    advance(ms) { now += ms; const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(now)); },
  };
}

test("game resumes after a hidden tab without counting hidden time or duplicating frames", () => {
  const preview = game();
  preview.enter();
  for (let i = 0; i < 20; i++) preview.advance(100);
  const before = preview.steps;
  preview.hide(true);
  assert.equal(preview.frames, 0);
  preview.advance(30000);
  assert.equal(preview.steps, before);
  preview.hide(false);
  preview.hide(false);
  preview.enter();
  assert.equal(preview.frames, 1);
  preview.advance(16);
  assert.equal(preview.steps, before + 1);
  for (let i = 0; i < 70; i++) preview.advance(100);
  assert.equal(preview.frames, 0);
  preview.hide(true); preview.hide(false);
  assert.equal(preview.frames, 0, "completed previews stay complete");
});

test("unstarted and reduced-motion previews do not start on tab restoration", () => {
  for (const reduced of [false, true]) {
    const preview = game({ reduced });
    preview.hide(true); preview.hide(false);
    assert.equal(preview.frames, 0);
    if (reduced) {
      preview.enter(); preview.hide(true); preview.hide(false);
      assert.equal(preview.frames, 0);
    }
  }
});

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../app/murph-e/footnoteNavigation.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function footnotes({ reduced = false, missing = false } = {}) {
  const calls = [], state = { backpackKey: "article-entry", backpackFrom: "/" };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, require: name => name === "../lib/backpackNavigation" ? navigation : require(name),
    document: { getElementById: id => missing ? null : {
      focus: () => calls.push(["focus", id]), scrollIntoView: options => calls.push(["scroll", id, options.behavior]),
    } },
    window: { history: { state, replaceState: (...args) => calls.push(["replace", ...args]) } },
    matchMedia: () => ({ matches: reduced }),
  });
  return { calls, state, click(hash, overrides = {}) {
    exports.jumpToFootnote({ button: 0, defaultPrevented: false,
      currentTarget: { hash, target: "", hasAttribute: () => false },
      preventDefault: () => calls.push(["prevent"]), ...overrides });
  } };
}

test("footnote and backlink replace the existing backpack entry and focus their targets", () => {
  for (const reduced of [false, true]) {
    for (const hash of ["#murphy-note", "#murphy-note-ref"]) {
      const page = footnotes({ reduced });
      page.click(hash);
      assert.equal(page.calls[1][0], "replace");
      assert.equal(page.calls[1][1], page.state);
      assert.equal(page.calls[1][3], hash);
      assert.deepEqual(page.calls[2], ["focus", hash.slice(1)]);
      assert.deepEqual(page.calls[3], ["scroll", hash.slice(1), reduced ? "instant" : "smooth"]);
    }
  }
});

test("modified footnote clicks and missing targets preserve native link behavior", () => {
  const page = footnotes();
  for (const overrides of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) page.click("#murphy-note", overrides);
  assert.equal(page.calls.length, 0);
  const missing = footnotes({ missing: true }); missing.click("#missing");
  assert.equal(missing.calls.length, 0);
});
