"""Constants for the Drive Route Card integration."""

from __future__ import annotations

import logging
from typing import Final

DOMAIN: Final = "drive_route_card"
LOGGER = logging.getLogger(__package__)

CONF_ORIGIN: Final = "origin"
CONF_DESTINATION: Final = "destination"
CONF_TRAVEL_MODE: Final = "travel_mode"
CONF_AVOID_TOLLS: Final = "avoid_tolls"
CONF_AVOID_HIGHWAYS: Final = "avoid_highways"
CONF_SCAN_INTERVAL: Final = "scan_interval"
CONF_WINDOW_ENABLED: Final = "window_enabled"
CONF_WINDOW_START: Final = "window_start"
CONF_WINDOW_END: Final = "window_end"
CONF_WEEKDAYS: Final = "weekdays"

LOCATION_DOMAINS: Final = ["zone", "person", "device_tracker"]

TRAVEL_MODE_DRIVE: Final = "drive"
TRAVEL_MODES: Final = [TRAVEL_MODE_DRIVE, "two_wheeler", "bicycle", "walk"]
# Only these modes take live traffic into account.
TRAFFIC_AWARE_MODES: Final = frozenset({TRAVEL_MODE_DRIVE, "two_wheeler"})

WEEKDAYS: Final = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

DEFAULT_SCAN_INTERVAL: Final = 10  # minutes
MIN_SCAN_INTERVAL: Final = 5
MAX_SCAN_INTERVAL: Final = 240
DEFAULT_WINDOW_START: Final = "06:00:00"
DEFAULT_WINDOW_END: Final = "09:00:00"
DEFAULT_WEEKDAYS: Final = WEEKDAYS[:5]

DEFAULT_OPTIONS: Final = {
    CONF_TRAVEL_MODE: TRAVEL_MODE_DRIVE,
    CONF_AVOID_TOLLS: False,
    CONF_AVOID_HIGHWAYS: False,
    CONF_SCAN_INTERVAL: DEFAULT_SCAN_INTERVAL,
    CONF_WINDOW_ENABLED: False,
    CONF_WINDOW_START: DEFAULT_WINDOW_START,
    CONF_WINDOW_END: DEFAULT_WINDOW_END,
    CONF_WEEKDAYS: DEFAULT_WEEKDAYS,
}

# Main route plus up to two alternatives.
MAX_ROUTES: Final = 3

SERVICE_REFRESH: Final = "refresh"

FRONTEND_URL_BASE: Final = "/drive_route_card"
CARD_FILENAME: Final = "drive-route-card.js"
