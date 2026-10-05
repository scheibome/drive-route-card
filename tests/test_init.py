"""Tests for setup, sensors, polling window and services."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import AsyncMock

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import SOURCE_REAUTH, ConfigEntryState
from homeassistant.const import ATTR_CONFIG_ENTRY_ID, STATE_UNKNOWN
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.drive_route_card.const import (
    CONF_SCAN_INTERVAL,
    CONF_WINDOW_ENABLED,
    CONF_WINDOW_END,
    CONF_WINDOW_START,
    DOMAIN,
    SERVICE_REFRESH,
)
from custom_components.drive_route_card.providers import (
    ProviderAuthError,
    ProviderError,
)

from .conftest import ROUTES


def _state(hass: HomeAssistant, entry: MockConfigEntry, key: str):
    entity_id = er.async_get(hass).async_get_entity_id(
        "sensor", DOMAIN, f"{entry.entry_id}_{key}"
    )
    assert entity_id
    return hass.states.get(entity_id)


async def test_sensors(hass: HomeAssistant, setup_entry: MockConfigEntry) -> None:
    """Sensors expose per-route values and fastest/slowest."""
    assert setup_entry.state is ConfigEntryState.LOADED

    route_1 = _state(hass, setup_entry, "route_1_duration")
    assert float(route_1.state) == 25
    assert route_1.attributes["unit_of_measurement"] == "min"
    assert route_1.attributes["description"] == "A9"
    assert float(_state(hass, setup_entry, "route_1_delay").state) == 5
    assert float(_state(hass, setup_entry, "route_1_distance").state) == 20.5

    fastest = _state(hass, setup_entry, "fastest_duration")
    assert float(fastest.state) == 23
    assert fastest.attributes["route"] == 2
    assert fastest.attributes["origin"] == {"latitude": 48.137, "longitude": 11.575}
    assert [r["polyline"] for r in fastest.attributes["routes"]] == [
        r.polyline for r in ROUTES
    ]

    slowest = _state(hass, setup_entry, "slowest_duration")
    assert float(slowest.state) == 30
    assert slowest.attributes["route"] == 3
    assert "routes" not in slowest.attributes


async def test_missing_alternative_is_unknown(
    hass: HomeAssistant, setup_entry: MockConfigEntry, mock_compute_routes: AsyncMock
) -> None:
    """When fewer routes come back the extra sensors become unknown."""
    mock_compute_routes.return_value = ROUTES[:1]
    await setup_entry.runtime_data.async_refresh()
    await hass.async_block_till_done()

    assert _state(hass, setup_entry, "route_3_duration").state == STATE_UNKNOWN
    assert float(_state(hass, setup_entry, "fastest_duration").state) == 25


async def test_polling_interval(
    hass: HomeAssistant,
    setup_entry: MockConfigEntry,
    mock_compute_routes: AsyncMock,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Routes are queried again after the configured interval."""
    assert mock_compute_routes.await_count == 1
    freezer.tick(timedelta(minutes=10))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert mock_compute_routes.await_count == 2


@pytest.mark.freeze_time("2026-10-05 12:00:00+00:00")  # Monday 05:00 US/Pacific
async def test_outside_window_keeps_data(
    hass: HomeAssistant,
    zones: None,
    mock_compute_routes: AsyncMock,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Outside the window only the first query and forced refreshes run."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={
            **mock_config_entry.options,
            CONF_SCAN_INTERVAL: 5,
            CONF_WINDOW_ENABLED: True,
            CONF_WINDOW_START: "06:00:00",
            CONF_WINDOW_END: "09:00:00",
        },
    )
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    assert mock_compute_routes.await_count == 1

    await mock_config_entry.runtime_data.async_refresh()
    assert mock_compute_routes.await_count == 1
    assert float(_state(hass, mock_config_entry, "route_1_duration").state) == 25

    await hass.services.async_call(DOMAIN, SERVICE_REFRESH, blocking=True)
    assert mock_compute_routes.await_count == 2


async def test_refresh_service_single_entry(
    hass: HomeAssistant, setup_entry: MockConfigEntry, mock_compute_routes: AsyncMock
) -> None:
    """The refresh action can target one entry and rejects unknown ones."""
    await hass.services.async_call(
        DOMAIN,
        SERVICE_REFRESH,
        {ATTR_CONFIG_ENTRY_ID: setup_entry.entry_id},
        blocking=True,
    )
    assert mock_compute_routes.await_count == 2

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, SERVICE_REFRESH, {ATTR_CONFIG_ENTRY_ID: "nope"}, blocking=True
        )


async def test_auth_error_starts_reauth(
    hass: HomeAssistant,
    zones: None,
    mock_compute_routes: AsyncMock,
    mock_config_entry: MockConfigEntry,
) -> None:
    """An invalid key fails setup and asks for a new one."""
    mock_compute_routes.side_effect = ProviderAuthError("denied")
    mock_config_entry.add_to_hass(hass)
    assert not await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert mock_config_entry.state is ConfigEntryState.SETUP_ERROR
    flows = hass.config_entries.flow.async_progress()
    assert [flow["context"]["source"] for flow in flows] == [SOURCE_REAUTH]


async def test_provider_error_retries(
    hass: HomeAssistant,
    zones: None,
    mock_compute_routes: AsyncMock,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Temporary errors and missing positions make setup retry later."""
    mock_compute_routes.side_effect = ProviderError("down")
    mock_config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    assert mock_config_entry.state is ConfigEntryState.SETUP_RETRY


async def test_unload(hass: HomeAssistant, setup_entry: MockConfigEntry) -> None:
    """The entry unloads cleanly."""
    assert await hass.config_entries.async_unload(setup_entry.entry_id)
    assert setup_entry.state is ConfigEntryState.NOT_LOADED
