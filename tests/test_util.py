"""Tests for helpers."""

from __future__ import annotations

from datetime import datetime, time

from homeassistant.core import HomeAssistant
import pytest

from custom_components.drive_route_card.providers import Coordinates
from custom_components.drive_route_card.util import (
    is_within_window,
    resolve_coordinates,
)

WORKDAYS = ["mon", "tue", "wed", "thu", "fri"]
# 2026-10-05 is a Monday.
MONDAY = datetime(2026, 10, 5)
SATURDAY = datetime(2026, 10, 10)


@pytest.mark.parametrize(
    ("now", "start", "end", "expected"),
    [
        (MONDAY.replace(hour=7), time(6), time(9), True),
        (MONDAY.replace(hour=9), time(6), time(9), False),
        (MONDAY.replace(hour=5, minute=59), time(6), time(9), False),
        (SATURDAY.replace(hour=7), time(6), time(9), False),
        # Overnight window belongs to the day it starts on.
        (MONDAY.replace(hour=23), time(22), time(2), True),
        (MONDAY.replace(hour=1), time(22), time(2), False),  # started Sunday
        (SATURDAY.replace(hour=1), time(22), time(2), True),  # started Friday
        (MONDAY.replace(hour=12), time(22), time(2), False),
        # start == end means all day.
        (MONDAY.replace(hour=12), time(0), time(0), True),
        (SATURDAY.replace(hour=12), time(0), time(0), False),
    ],
)
def test_is_within_window(
    now: datetime, start: time, end: time, expected: bool
) -> None:
    """Test the polling window."""
    assert is_within_window(now, start, end, WORKDAYS) is expected


async def test_resolve_zone(hass: HomeAssistant, zones: None) -> None:
    """Zones resolve to their coordinates."""
    assert resolve_coordinates(hass, "zone.home") == Coordinates(48.137, 11.575)


async def test_resolve_person_in_zone(hass: HomeAssistant, zones: None) -> None:
    """A person without GPS attributes resolves via the zone it is in."""
    hass.states.async_set("person.anna", "Work")
    assert resolve_coordinates(hass, "person.anna") == Coordinates(48.353, 11.786)


async def test_resolve_unavailable(hass: HomeAssistant) -> None:
    """Unknown positions resolve to None."""
    hass.states.async_set("device_tracker.phone", "not_home")
    assert resolve_coordinates(hass, "device_tracker.phone") is None
    assert resolve_coordinates(hass, "person.missing") is None
