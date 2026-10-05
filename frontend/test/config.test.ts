import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeConfig } from "../src/config.ts";

test("drops empty values and defaults", () => {
  assert.deepEqual(
    normalizeConfig({
      type: "custom:drive-route-card",
      entity: "sensor.commute_fastest_travel_time",
      api_key: "key",
      title: "",
      height: 400,
      show_alternatives: true,
      show_legend: false,
    }),
    {
      type: "custom:drive-route-card",
      entity: "sensor.commute_fastest_travel_time",
      api_key: "key",
      show_legend: false,
    },
  );
});

test("keeps non-default values", () => {
  assert.deepEqual(normalizeConfig({ height: 300, show_alternatives: false }), {
    height: 300,
    show_alternatives: false,
  });
});
