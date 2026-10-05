"""Tests for the config and options flows."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

from homeassistant.config_entries import SOURCE_USER
from homeassistant.const import CONF_API_KEY, CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.drive_route_card.const import (
    CONF_AVOID_HIGHWAYS,
    CONF_AVOID_TOLLS,
    CONF_DESTINATION,
    CONF_ORIGIN,
    CONF_SCAN_INTERVAL,
    CONF_TRAVEL_MODE,
    CONF_WEEKDAYS,
    CONF_WINDOW_ENABLED,
    CONF_WINDOW_END,
    CONF_WINDOW_START,
    DEFAULT_OPTIONS,
    DOMAIN,
)
from custom_components.drive_route_card.providers import (
    ProviderAuthError,
    ProviderError,
)

USER_INPUT = {
    CONF_NAME: "Commute",
    CONF_API_KEY: "test-key",
    CONF_ORIGIN: "zone.home",
    CONF_DESTINATION: "zone.work",
    CONF_TRAVEL_MODE: "two_wheeler",
    CONF_AVOID_TOLLS: True,
    CONF_AVOID_HIGHWAYS: False,
}


@pytest.fixture(autouse=True)
def mock_setup_entry() -> AsyncMock:
    """Don't set up the entry after the flow finishes."""
    with patch(
        "custom_components.drive_route_card.async_setup_entry", return_value=True
    ) as mock:
        yield mock


async def test_user_flow(
    hass: HomeAssistant, zones: None, mock_compute_routes: AsyncMock
) -> None:
    """A valid key creates an entry with routing options."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Commute"
    assert result["data"] == {
        CONF_API_KEY: "test-key",
        CONF_ORIGIN: "zone.home",
        CONF_DESTINATION: "zone.work",
    }
    assert result["options"] == {
        **DEFAULT_OPTIONS,
        CONF_TRAVEL_MODE: "two_wheeler",
        CONF_AVOID_TOLLS: True,
    }
    mock_compute_routes.assert_awaited_once()


@pytest.mark.parametrize(
    ("side_effect", "error"),
    [
        (ProviderAuthError("denied"), "invalid_auth"),
        (ProviderError("down"), "cannot_connect"),
        (RuntimeError, "unknown"),
    ],
)
async def test_user_flow_errors(
    hass: HomeAssistant,
    zones: None,
    mock_compute_routes: AsyncMock,
    side_effect: Exception,
    error: str,
) -> None:
    """Validation errors are shown and the flow can recover."""
    mock_compute_routes.side_effect = side_effect
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": error}

    mock_compute_routes.side_effect = None
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY


async def test_same_location(
    hass: HomeAssistant, zones: None, mock_compute_routes: AsyncMock
) -> None:
    """Origin and destination must differ."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {**USER_INPUT, CONF_DESTINATION: "zone.home"}
    )
    assert result["errors"] == {"base": "same_location"}
    mock_compute_routes.assert_not_awaited()


async def test_unresolvable_location_skips_validation(
    hass: HomeAssistant, zones: None, mock_compute_routes: AsyncMock
) -> None:
    """A person without position can still be configured."""
    hass.states.async_set("person.anna", "unknown")
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {**USER_INPUT, CONF_ORIGIN: "person.anna"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    mock_compute_routes.assert_not_awaited()


async def test_reauth(
    hass: HomeAssistant,
    zones: None,
    mock_compute_routes: AsyncMock,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A new API key replaces the old one."""
    mock_config_entry.add_to_hass(hass)
    result = await mock_config_entry.start_reauth_flow(hass)
    assert result["step_id"] == "reauth_confirm"

    mock_compute_routes.side_effect = ProviderAuthError("denied")
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_API_KEY: "still-bad"}
    )
    assert result["errors"] == {"base": "invalid_auth"}

    mock_compute_routes.side_effect = None
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_API_KEY: "new-key"}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reauth_successful"
    assert mock_config_entry.data[CONF_API_KEY] == "new-key"


async def test_options_flow(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Options are stored with an integer interval."""
    mock_config_entry.add_to_hass(hass)
    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
    assert result["type"] is FlowResultType.FORM

    options = {
        CONF_TRAVEL_MODE: "drive",
        CONF_AVOID_TOLLS: False,
        CONF_AVOID_HIGHWAYS: True,
        CONF_SCAN_INTERVAL: 15.0,
        CONF_WINDOW_ENABLED: True,
        CONF_WINDOW_START: "16:00:00",
        CONF_WINDOW_END: "19:00:00",
        CONF_WEEKDAYS: ["mon", "fri"],
    }
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], options
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert mock_config_entry.options == {**options, CONF_SCAN_INTERVAL: 15}
