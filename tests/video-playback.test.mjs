import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { observeVideoPlayback, requestVideoPlayback } from "../app/components/videoPlayback.ts";

const originalDocument = globalThis.document;
const originalObserver = globalThis.IntersectionObserver;
let observers;
let cleanups;

class Video extends EventTarget {
  paused = true;
  preload = "none";
  playCalls = 0;
  loads = 0;
  rejectPlay = false;
  load() { this.loads++; }
  play() {
    this.playCalls++;
    if (this.rejectPlay) return Promise.reject(new Error("Autoplay denied"));
    this.paused = false;
    this.dispatchEvent(new Event("playing"));
    return Promise.resolve();
  }
  pause() {
    if (this.paused) return;
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  }
}

beforeEach(() => {
  observers = [];
  cleanups = [];
  globalThis.document = Object.assign(new EventTarget(), { hidden: false });
  globalThis.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
    intersect(visible) { this.callback([{ isIntersecting: visible }]); }
  };
});

afterEach(() => {
  cleanups.forEach(cleanup => cleanup());
  globalThis.document = originalDocument;
  globalThis.IntersectionObserver = originalObserver;
});

function mount(video, paused = false, onChange) {
  const controller = observeVideoPlayback(video, {}, paused, onChange);
  cleanups.push(controller.dispose);
  return { observer: observers.at(-1), cleanup: controller.dispose, controller };
}

const settle = () => new Promise(resolve => setImmediate(resolve));

test("defers loading and playback until visible, pauses offscreen, and resumes", async () => {
  const video = new Video();
  const { observer } = mount(video);
  assert.equal(video.loads, 0);
  assert.equal(video.playCalls, 0);
  observer.intersect(true);
  await settle();
  assert.equal(video.loads, 1);
  assert.equal(video.paused, false);
  observer.intersect(false);
  assert.equal(video.paused, true);
  observer.intersect(true);
  await settle();
  assert.equal(video.loads, 1);
  assert.equal(video.playCalls, 2);
});

test("a paused or reduced-motion video loads a still without autoplay", () => {
  const video = new Video();
  const { observer } = mount(video, true);
  observer.intersect(true);
  assert.equal(video.loads, 1);
  assert.equal(video.playCalls, 0);
  assert.equal(video.paused, true);
});

test("backgrounding the document stops video and foregrounding resumes it", async () => {
  const video = new Video();
  mount(video).observer.intersect(true);
  await settle();
  document.hidden = true;
  document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(video.paused, true);
  document.hidden = false;
  document.dispatchEvent(new Event("visibilitychange"));
  await settle();
  assert.equal(video.paused, false);
});

test("rejected autoplay reports stopped and a user play can recover", async () => {
  const video = new Video();
  const states = [];
  video.rejectPlay = true;
  mount(video, false, playing => states.push(playing)).observer.intersect(true);
  await settle();
  assert.equal(states.at(-1), false);
  video.rejectPlay = false;
  requestVideoPlayback(video, false);
  await settle();
  assert.equal(states.at(-1), true);
});

test("unmount pauses playback and detaches observers and listeners", async () => {
  const video = new Video();
  const states = [];
  const { observer, cleanup } = mount(video, false, playing => states.push(playing));
  observer.intersect(true);
  await settle();
  cleanup();
  const count = states.length;
  document.dispatchEvent(new Event("visibilitychange"));
  video.dispatchEvent(new Event("playing"));
  assert.equal(video.paused, true);
  assert.equal(observer.disconnected, true);
  assert.equal(states.length, count);
  assert.equal(video.playCalls, 1);
});


test("rapid hide/show retries an interrupted pending play", async () => {
  const video = new Video();
  let rejectPending;
  video.play = function () {
    this.playCalls++;
    if (this.playCalls === 1) {
      return new Promise((resolve, reject) => { rejectPending = reject; });
    }
    this.paused = false;
    this.dispatchEvent(new Event("playing"));
    return Promise.resolve();
  };
  const { observer } = mount(video);
  observer.intersect(true);
  observer.intersect(false);
  observer.intersect(true);
  rejectPending(Object.assign(new Error("Interrupted"), { name: "AbortError" }));
  await settle();
  assert.equal(video.playCalls, 2);
  assert.equal(video.paused, false);
});

test("manual play overrides reduced motion without recreating the controller", async () => {
  const video = new Video();
  const { observer, controller } = mount(video, true);
  observer.intersect(true);
  requestVideoPlayback(video, false);
  assert.equal(video.paused, false);
  assert.equal(video.playCalls, 1);
  controller.setPaused(false); // React reconciles the same user intent.
  await settle();
  assert.equal(video.playCalls, 1);
  assert.equal(observer.disconnected, undefined);
  requestVideoPlayback(video, true);
  assert.equal(video.paused, true);
});

test("disposal does not retry an interrupted pending play", async () => {
  const video = new Video();
  let rejectPending;
  video.play = function () {
    this.playCalls++;
    return new Promise((resolve, reject) => { rejectPending = reject; });
  };
  const { observer, cleanup } = mount(video);
  observer.intersect(true);
  cleanup();
  rejectPending(Object.assign(new Error("Interrupted"), { name: "AbortError" }));
  await settle();
  assert.equal(video.playCalls, 1);
});
