import assert from "node:assert/strict";
import { test } from "node:test";

import { pickLabelPoints } from "../src/labels.ts";
import type { LatLng } from "../src/polyline.ts";

/** Straight line from (0,0) to (0,1) bending out to `bulge` latitude in the middle. */
function route(bulge: number): LatLng[] {
  return Array.from({ length: 101 }, (_, i) => ({
    lat: bulge * Math.sin((i / 100) * Math.PI),
    lng: i / 100,
  }));
}

test("labels sit where routes diverge", () => {
  const [north, south] = pickLabelPoints([route(0.5), route(-0.5)]);
  assert.ok(north && north.lat > 0.4, `north label at ${north?.lat}`);
  assert.ok(south && south.lat < -0.4, `south label at ${south?.lat}`);
});

test("a single route is labelled in the middle", () => {
  const [label] = pickLabelPoints([route(0)]);
  assert.equal(label?.lng, 0.5);
});

test("labels avoid the shared start and end", () => {
  for (const label of pickLabelPoints([route(0.5), route(0), route(-0.5)])) {
    assert.ok(label && label.lng >= 0.2 && label.lng <= 0.8);
  }
});

test("empty routes get no label", () => {
  assert.deepEqual(pickLabelPoints([[], route(0)])[0], undefined);
});
