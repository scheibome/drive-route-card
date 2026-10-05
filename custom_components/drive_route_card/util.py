"""Helpers for location resolution and polling windows."""

from __future__ import annotations

from datetime import datetime, time

from homeassistant.core import HomeAssistant
from homeassistant.helpers.location import find_coordinates

from .const import WEEKDAYS
from .providers import Coordinates


def resolve_coordinates(hass: HomeAssistant, entity_id: str) -> Coordinates | None:
    """Return the current position of a zone, person or device tracker.

    `find_coordinates` follows persons/trackers into the zone they are in and
    may return a non-coordinate string (e.g. an address or 'not_home'), which
    is treated as unavailable.
    """
    if (value := find_coordinates(hass, entity_id)) is None:
        return None
    try:
        latitude, longitude = (float(part) for part in value.split(","))
    except ValueError:
        return None
    return Coordinates(latitude, longitude)


def is_within_window(
    now: datetime, start: time, end: time, weekdays: list[str]
) -> bool:
    """Return whether `now` is inside the daily polling window.

    A window with start > end spans midnight; it belongs to the weekday on
    which it starts. start == end means the whole day.
    """
    today = WEEKDAYS[now.weekday()]
    yesterday = WEEKDAYS[(now.weekday() - 1) % 7]
    current = now.time()

    if start == end:
        return today in weekdays
    if start < end:
        return today in weekdays and start <= current < end
    if current >= start:
        return today in weekdays
    if current < end:
        return yesterday in weekdays
    return False
