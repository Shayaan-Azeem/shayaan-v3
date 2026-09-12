import assert from "node:assert/strict";
import { test } from "node:test";
import { sampleSource } from "../app/components/pixelCanvas.ts";

test("canvas media preserves source proportions across card sizes and sampling grids", () => {
  for (const [displayWidth, displayHeight] of [[291, 154], [291, 174], [291, 194], [350, 262.5]]) {
    for (const [sourceWidth, sourceHeight] of [[640, 480], [1920, 1080], [1080, 1920]]) {
      for (const [columns, rows] of [[120, 90], [64, 48]]) {
        let crop;
        const sampler = {
          columns,
          rows,
          context: {
            drawImage(...args) { crop = args.slice(1, 5); },
            getImageData() { return { data: new Uint8ClampedArray() }; },
          },
        };
        sampleSource(sampler, {}, sourceWidth, sourceHeight, displayWidth / displayHeight);
        const [x, y, width, height] = crop;
        // The full sampling-to-display pipeline must scale both axes equally.
        assert.ok(Math.abs(displayWidth / width - displayHeight / height) < 1e-10);
        assert.ok(x >= 0 && y >= 0);
        assert.ok(x + width <= sourceWidth + 1e-10);
        assert.ok(y + height <= sourceHeight + 1e-10);
        assert.ok(Math.abs(x * 2 + width - sourceWidth) < 1e-10);
        assert.ok(Math.abs(y * 2 + height - sourceHeight) < 1e-10);
      }
    }
  }
});
