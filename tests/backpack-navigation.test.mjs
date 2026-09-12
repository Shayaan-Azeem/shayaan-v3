import assert from "node:assert/strict";
import { test } from "node:test";
import { BACKPACK_ROUTES, createBackpackNavigation, getBackpackPath, isPlainNavigation } from "../app/lib/backpackNavigation.ts";

function harness(initial = "/") {
  const calls = [];
  const navigation = createBackpackNavigation(initial, Object.fromEntries(
    ["rememberScroll", "commit", "push", "focus", "scroll"].map((name) => [name, (...args) => calls.push([name, ...args])]),
  ));
  return { calls, navigation };
}

test("every bundled route renders synchronously before its URL changes", () => {
  for (const path of Object.keys(BACKPACK_ROUTES).filter((path) => path !== "/")) {
    const { calls, navigation } = harness();
    navigation.navigate(path);
    assert.deepEqual(calls, [
      ["rememberScroll"], ["commit", path], ["push", path], ["focus"], ["scroll", { x: 0, y: 0 }],
    ]);
  }
});

test("back/forward restores the page and scroll without creating another history entry", () => {
  const { calls, navigation } = harness("/projects");
  navigation.restore("/events", { x: 0, y: 320 });
  assert.deepEqual(calls, [["commit", "/events"], ["focus"], ["scroll", { x: 0, y: 320 }]]);
  calls.length = 0;
  navigation.navigate("/events");
  assert.deepEqual(calls, [["focus"], ["scroll", { x: 0, y: 0 }]], "reselecting the current page must not duplicate history");
});

test("routing is an explicit allowlist with direct-link titles and descriptions", () => {
  for (const [path, metadata] of Object.entries(BACKPACK_ROUTES)) {
    assert.equal(getBackpackPath(path), path);
    if (path !== "/") assert.equal(getBackpackPath(`${path}/`), path);
    assert.ok(metadata.title.includes("Shayaan Azeem"));
    assert.ok(metadata.description.length > 20);
  }
  for (const path of ["/missing", "/projects/unknown", "/PROJECTS", "constructor", "__proto__", "https://example.com/projects"]) {
    assert.equal(getBackpackPath(path), null);
  }
});

test("modified clicks, new tabs, downloads, and cancelled navigation keep native browser behavior", () => {
  const plain = { defaultPrevented: false, button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };
  assert.equal(isPlainNavigation(plain, "", false), true);
  assert.equal(isPlainNavigation(plain, "_self", false), true);
  for (const key of ["defaultPrevented", "metaKey", "ctrlKey", "shiftKey", "altKey"]) {
    assert.equal(isPlainNavigation({ ...plain, [key]: true }, "", false), false);
  }
  for (const button of [1, 2]) assert.equal(isPlainNavigation({ ...plain, button }, "", false), false);
  for (const target of ["_blank", "_parent", "preview"]) assert.equal(isPlainNavigation(plain, target, false), false);
  assert.equal(isPlainNavigation(plain, "", true), false);
});
