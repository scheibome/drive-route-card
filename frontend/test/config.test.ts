import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeConfig, toCssColor, toRgb } from "../src/config.ts";

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

test("converts colors to CSS", () => {
  assert.equal(toCssColor([26, 115, 232]), "rgb(26, 115, 232)");
  assert.equal(toCssColor("#1a73e8"), "#1a73e8");
  assert.equal(toCssColor(""), undefined);
  assert.equal(toCssColor(undefined), undefined);
  assert.equal(toCssColor([1, 2]), undefined);
});

test("converts hex colors for the color picker", () => {
  assert.deepEqual(toRgb("#1a73e8"), [26, 115, 232]);
  assert.deepEqual(toRgb("#fff"), [255, 255, 255]);
  assert.equal(toRgb("red"), "red");
  assert.deepEqual(toRgb([1, 2, 3]), [1, 2, 3]);
});
