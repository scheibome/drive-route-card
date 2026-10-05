"""Fixtures for Drive Route Card tests."""

from __future__ import annotations

from collections.abc import Generator
from unittest.mock import AsyncMock, patch

from homeassistant.const import CONF_API_KEY
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.drive_route_card.const import (
    CONF_DESTINATION,
    CONF_ORIGIN,
    DEFAULT_OPTIONS,
    DOMAIN,
)
from custom_components.drive_route_card.providers import Route

ROUTES = [
    Route(
        duration=1500,
        static_duration=1200,
        distance=20500,
        polyline="_p~iF~ps|U_ulLnnqC",
        description="A9",
    ),
    Route(
        duration=1380,
        static_duration=1380,
        distance=23000,
        polyline="_ulLnnqC_mqNvxq`@",
        description="B13",
    ),
    Route(
        duration=1800,
        static_duration=1500,
        distance=19000,
        polyline="_p~iF~ps|U",
        description=None,
    ),
]

ENTRY_DATA = {
    CONF_API_KEY: "test-key",
    CONF_ORIGIN: "zone.home",
    CONF_DESTINATION: "zone.work",
}


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Allow loading the custom integration in every test."""


@pytest.fixture
def zones(hass: HomeAssistant) -> None:
    """Create origin and destination zones."""
    hass.states.async_set(
        "zone.home",
        "0",
        {"latitude": 48.137, "longitude": 11.575, "friendly_name": "Home"},
    )
    hass.states.async_set(
        "zone.work",
        "0",
        {"latitude": 48.353, "longitude": 11.786, "friendly_name": "Work"},
    )


@pytest.fixture
def mock_compute_routes() -> Generator[AsyncMock]:
    """Patch the Google provider to return fixed routes."""
    with patch(
        "custom_components.drive_route_card.providers.google.GoogleRoutesProvider.async_compute_routes",
        AsyncMock(return_value=ROUTES),
    ) as mock:
        yield mock


@pytest.fixture
def mock_config_entry() -> MockConfigEntry:
    """Return a config entry for Home -> Work."""
    return MockConfigEntry(
        domain=DOMAIN,
        title="Commute",
        data=ENTRY_DATA,
        options=dict(DEFAULT_OPTIONS),
    )


@pytest.fixture
async def setup_entry(
    hass: HomeAssistant,
    zones: None,
    mock_compute_routes: AsyncMock,
    mock_config_entry: MockConfigEntry,
) -> MockConfigEntry:
    """Set up the integration with the mock entry."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry
