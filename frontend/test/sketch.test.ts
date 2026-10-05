import assert from "node:assert/strict";
import { test } from "node:test";

import { buildSketch } from "../src/sketch.ts";

const REFERENCE = "_p~iF~ps|U_ulLnnqC_mqNvxq`@";

test("projects routes into the viewBox with padding", () => {
  const sketch = buildSketch([REFERENCE], 0, 400, 200);
  assert.equal(sketch.lines.length, 1);
  const coords = sketch.lines[0].d
    .slice(1)
    .split("L")
    .map((pair) => pair.split(",").map(Number));
  for (const [x, y] of coords) {
    assert.ok(x >= 16 - 0.1 && x <= 384 + 0.1, `x ${x} inside`);
    assert.ok(y >= 16 - 0.1 && y <= 184 + 0.1, `y ${y} inside`);
  }
  // Northernmost point (last) is at the top.
  assert.ok(coords[2][1] < coords[0][1]);
});

test("draws the fastest route last", () => {
  const sketch = buildSketch([REFERENCE, REFERENCE, REFERENCE], 1, 400, 200);
  assert.deepEqual(
    sketch.lines.map((line) => line.fastest),
    [false, false, true],
  );
});

test("falls back to demo routes without data", () => {
  const sketch = buildSketch(undefined, 0, 400, 200);
  assert.equal(sketch.lines.length, 3);
  assert.equal(sketch.lines.filter((line) => line.fastest).length, 1);
});

test("keeps the fastest flag when an empty route is skipped", () => {
  const sketch = buildSketch(["", REFERENCE], 1, 400, 200);
  assert.deepEqual(
    sketch.lines.map((line) => line.fastest),
    [true],
  );
});
