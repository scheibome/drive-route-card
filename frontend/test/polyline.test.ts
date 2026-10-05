import assert from "node:assert/strict";
import { test } from "node:test";

import { decodePolyline } from "../src/polyline.ts";

test("decodes Google's reference polyline", () => {
  // Example from https://developers.google.com/maps/documentation/utilities/polylinealgorithm
  assert.deepEqual(decodePolyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@"), [
    { lat: 38.5, lng: -120.2 },
    { lat: 40.7, lng: -120.95 },
    { lat: 43.252, lng: -126.453 },
  ]);
});

test("returns no points for an empty string", () => {
  assert.deepEqual(decodePolyline(""), []);
});
