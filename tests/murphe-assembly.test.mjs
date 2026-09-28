import assert from "node:assert/strict";
import { test } from "node:test";
import { scrollProgress, separation } from "../public/murph-e/model/motion.js";

test("assembly progress follows the sticky travel and clamps outside the section", () => {
  assert.equal(scrollProgress(500, 2400, 760), 0);
  assert.equal(scrollProgress(16, 2400, 760), 0);
  assert.equal(scrollProgress(-804, 2400, 760), 0.5);
  assert.equal(scrollProgress(-1624, 2400, 760), 1);
  assert.equal(scrollProgress(-2400, 2400, 760), 1);
  assert.ok(Number.isFinite(scrollProgress(0, 460, 460)));
});

test("the shell opens before the CRT and control board, and scrolling reverses cleanly", () => {
  assert.ok(separation(0.2, "left-shell") > 0);
  assert.equal(separation(0.2, "display"), 0);
  assert.equal(separation(0.35, "control-board"), 0);
  for (const group of ["left-shell", "display", "control-board"]) {
    assert.equal(separation(0, group), 0);
    assert.equal(separation(1, group), 1);
    assert.ok(separation(0.75, group) > separation(0.5, group));
    assert.equal(separation(-1, group), 0);
    assert.equal(separation(2, group), 1);
  }
});
