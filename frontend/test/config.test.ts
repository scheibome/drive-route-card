import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeConfig, parseMapStyle, toCssColor, toRgb } from "../src/config.ts";

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

test("drops colors and map options equal to the defaults", () => {
  assert.deepEqual(
    normalizeConfig({
      fastest_color: [26, 115, 232],
      alternative_color: [1, 2, 3],
      map_type: "roadmap",
      show_traffic: true,
    }),
    { alternative_color: [1, 2, 3], show_traffic: true },
  );
});

const DARK_WATER = [{ featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] }];

test("parses map styles from a list or a JSON string", () => {
  assert.equal(parseMapStyle(undefined), undefined);
  assert.equal(parseMapStyle(""), undefined);
  assert.deepEqual(parseMapStyle(DARK_WATER), DARK_WATER);
  assert.deepEqual(parseMapStyle(JSON.stringify(DARK_WATER)), DARK_WATER);
});

test("rejects unusable map styles with a readable message", () => {
  assert.throws(() => parseMapStyle("[{"), /not valid JSON/);
  assert.throws(() => parseMapStyle({ stylers: [] }), /must be a list/);
  assert.throws(() => parseMapStyle([{ featureType: "water" }]), /rule 1 needs a "stylers" list/);
});
