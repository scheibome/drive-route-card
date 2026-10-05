# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-10-05

### Added

- In a panel view the card fills the whole height and leaves room for the edit buttons while the dashboard is edited. The map takes scroll and drag gestures directly there.
- Map type option (map, satellite, satellite with labels, terrain) and Google's live traffic layer (`map_type`, `show_traffic`).
- A map type switch and a traffic button on the map, which can be hidden with `show_controls: false`.
- Map styling with Google's JSON styling (`map_style`, as YAML list or pasted JSON) or a cloud map ID (`map_id`). An invalid style is shown as a message in the card.
- Project logo, plus icon and logo PNGs for the Home Assistant brands repository (`images/brand/`).

### Changed

- Default route colors are now Google Maps-like (dark blue for the fastest route, light blue for the alternatives) instead of the theme's primary color and gray. Each route also has a darker edge.
- The editor's color pickers show the actual default colors.

### Fixed

- The fastest route no longer changes color between the editor preview and the dashboard when the dashboard uses a different theme.

## [0.2.0] - 2026-10-05

### Added

- Each route on the map is labelled with its travel time and distance, like in Google Maps. The fastest time is shown in green, and routes delayed by at least 5 minutes in red. Turn the labels off with `show_labels: false`.
- Configurable colors for the fastest and the alternative routes (`fastest_color`, `alternative_color`, or the color pickers in the editor).
- Live preview in the card picker: a sketch of your routes, or a sample sketch if no route is set up yet. The sketch is also shown until an API key is entered.
- The card shows a clear message when Google rejects the Maps JavaScript API key, instead of a grey map.
- Debug logging of how many routes the Google Routes API returned.

### Changed

- The map refits its view when the card is resized.

## [0.1.0] - 2026-10-05

### Added

- Config flow per origin/destination pair. Origin and destination can be a zone, person or device tracker.
- Google Routes API provider with traffic-aware travel times and up to two alternative routes.
- Sensors per route for travel time, traffic delay and distance, plus *fastest* and *slowest travel time* sensors for badges.
- Options for travel mode, avoiding tolls and highways, update interval and an optional polling time window with weekdays.
- `drive_route_card.refresh` action that queries immediately, also outside the time window.
- Reauthentication flow when Google rejects the API key.
- Lovelace card with visual editor that draws all routes on Google Maps. It is bundled with the integration, so no extra dashboard resource is needed.
- English and German translations.

[Unreleased]: https://github.com/scheibome/drive-route-card/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/scheibome/drive-route-card/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/scheibome/drive-route-card/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/scheibome/drive-route-card/releases/tag/v0.1.0
