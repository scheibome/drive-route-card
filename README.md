<p align="center">
  <img src="images/logo.svg" alt="Drive Route Card logo" width="160">
</p>

# Drive Route Card

A Home Assistant integration that shows the current fastest route between two places together with up to two alternatives. It provides:

- **Sensors** for the travel time, traffic delay and distance of each route, plus *fastest* and *slowest* travel time sensors that work well as badges.
- **A Lovelace card** that draws all routes on a Google map. The card is bundled with the integration, so you don't need to add a separate dashboard resource.

Routes are calculated with the [Google Routes API](https://developers.google.com/maps/documentation/routes). More providers (HERE, TomTom, OSRM) are planned.

> **Status:** early development (0.x). Configuration and entities may still change.

## Installation

### HACS (custom repository)

1. In HACS, open *⋮ → Custom repositories*, add `https://github.com/scheibome/drive-route-card` with category **Integration**.
2. Install **Drive Route Card** and restart Home Assistant.

### Manual

Copy `custom_components/drive_route_card` into your `config/custom_components` folder and restart Home Assistant.

## Google API keys and costs

You need a Google Cloud project with billing enabled and **two API keys**:

| Key | API to enable | Restriction | Used by |
|---|---|---|---|
| Server key | Routes API | none or your HA host's IP address | the integration |
| Browser key | Maps JavaScript API | HTTP referrer = your Home Assistant URL | the card |

Google bills every route query and every map load beyond a monthly free quota. Traffic-aware queries with alternatives are in a higher pricing tier, so check the current [pricing](https://developers.google.com/maps/billing-and-pricing/pricing) and set a budget alert. As a rule of thumb, polling every 10 minutes around the clock costs about **4,300 queries per route per month**. To use far fewer, enable the time window option (for example weekdays 06:00–09:00).

## Configuration

*Settings → Devices & services → Add integration → Drive Route Card*

| Field | Description |
|---|---|
| Name | Device name, e.g. "Commute" |
| Google Maps API key | The server key |
| Origin / Destination | A `zone`, `person` or `device_tracker`. Persons and trackers follow their current position. |
| Travel mode | Car, motorcycle/scooter, bicycle or walking. Live traffic only applies to car and motorcycle. |
| Avoid tolls / highways | Only applies to car and motorcycle |

You can add one entry per origin/destination pair. Under **Configure** you can change the routing options as well as:

- **Update interval** (default 10 min, minimum 5)
- **Time window**: only query between a start and end time on selected weekdays. The window may span midnight. Outside the window the sensors keep the last result.

### Entities

| Entity | Description |
|---|---|
| `Fastest travel time` | Shortest duration of all routes. Its attributes also contain the data the card uses to draw the map. |
| `Slowest travel time` | Longest duration of all routes |
| `Route 1–3 travel time` | Duration per route; route 1 is Google's main route |
| `Route 1–3 traffic delay` | Duration with traffic minus duration without traffic |
| `Route 1–3 distance` | Distance per route |

If Google returns fewer than three routes, the extra sensors become `unknown`.

### Badge

Add a normal entity badge to a dashboard and pick either the *Fastest travel time* or the *Slowest travel time* sensor.

### Action `drive_route_card.refresh`

Queries immediately, even outside the time window. Pass `config_entry_id` to refresh only one route.

## Card

Add the card from the dashboard's card picker (*Drive Route Card*) and configure it in the visual editor. The route picker only lists the *Fastest travel time* sensors of this integration.

Or configure it in YAML:

```yaml
type: custom:drive-route-card
entity: sensor.commute_fastest_travel_time
api_key: YOUR_BROWSER_KEY
title: Commute          # optional
height: 400             # optional, pixels
show_alternatives: true # optional
show_legend: true       # optional
show_labels: true       # optional, time and distance bubbles on the routes
fastest_color: "#1a73e8"     # optional, any CSS color
alternative_color: "#8ab4f8" # optional, any CSS color
map_type: roadmap       # optional: roadmap, satellite, hybrid, terrain
show_traffic: false     # optional, Google's live traffic layer
show_controls: true     # optional, map type switch and traffic button on the map
map_id: ""              # optional, map ID for Google's cloud-based styling
map_style:              # optional, Google's JSON map styling
  - elementType: geometry
    stylers:
      - color: "#242f3e"
  - featureType: water
    elementType: geometry
    stylers:
      - color: "#17263c"
```

By default the fastest route is dark blue and the alternatives light blue, like in Google Maps. You can set your own colors (any CSS color, or pick them in the editor). The map type and traffic layer set in the config are the initial state. With `show_controls` you can switch them on the map itself; those switches are not saved.

**Map styling:** `map_style` takes Google's [JSON styling](https://developers.google.com/maps/documentation/javascript/style-reference), a list of rules with `featureType`, `elementType` and `stylers`. In the visual editor you can paste the JSON as is, for example from Google's styling wizard or snazzymaps.com. Alternatively, set `map_id` to use a style created in the Google Cloud console (cloud-based styling). When a map ID is set, Google ignores `map_style`.

In a **panel view** the card fills the whole height, and `height` is ignored. While the dashboard is being edited, the card leaves room for Home Assistant's edit buttons. In a panel view the map also takes scroll and drag gestures directly; elsewhere you hold Ctrl (or use two fingers) to zoom, so the page still scrolls.

Like in Google Maps, each route is labelled with its travel time and distance. The fastest time is shown in green and routes delayed by at least 5 minutes in red.

Until an API key is set, the card shows a sketch of the routes instead of the map. This sketch is also what the card picker shows as preview.

### Fewer routes than in Google Maps?

The Routes API decides how many alternatives it returns, and it often returns fewer or different routes than the Google Maps app. "Avoid highways" or "Avoid tolls" also remove routes. To see how many routes Google returned, enable debug logging:

```yaml
logger:
  logs:
    custom_components.drive_route_card: debug
```

## Development

The repository contains two parts:

- `custom_components/drive_route_card/`: the integration (Python)
- `frontend/`: the source of the card (TypeScript + Lit). Its build output is committed to `custom_components/drive_route_card/www/` and served by the integration.

### Integration

Requires Python 3.14.

```bash
python3.14 -m venv .venv && source .venv/bin/activate
pip install -r requirements_test.txt
pytest
ruff check . && ruff format --check .
```

### Card

```bash
cd frontend
npm ci
npm run typecheck
npm test
npm run build   # or: npm run watch
```

Commit the rebuilt `www/drive-route-card.js` together with your source changes. CI fails if the bundle is out of date.

### Adding a routing provider

Implement `RouteProvider` from `providers/base.py` and return routes with polylines in Google's encoded polyline format. The sensors work unchanged; the card currently renders on Google Maps only.

## License

[MIT](LICENSE)
