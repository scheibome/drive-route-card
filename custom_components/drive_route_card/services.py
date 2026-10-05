"""Services for Drive Route Card."""

from __future__ import annotations

import asyncio

from homeassistant.const import ATTR_CONFIG_ENTRY_ID
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
import voluptuous as vol

from .const import DOMAIN, SERVICE_REFRESH
from .coordinator import DriveRouteConfigEntry

REFRESH_SCHEMA = vol.Schema({vol.Optional(ATTR_CONFIG_ENTRY_ID): cv.string})


@callback
def async_setup_services(hass: HomeAssistant) -> None:
    """Register integration services."""

    async def _async_refresh(call: ServiceCall) -> None:
        entries: list[DriveRouteConfigEntry] = hass.config_entries.async_loaded_entries(
            DOMAIN
        )
        if entry_id := call.data.get(ATTR_CONFIG_ENTRY_ID):
            entries = [entry for entry in entries if entry.entry_id == entry_id]
            if not entries:
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="entry_not_loaded",
                    translation_placeholders={"entry_id": entry_id},
                )
        await asyncio.gather(
            *(entry.runtime_data.async_force_refresh() for entry in entries)
        )

    hass.services.async_register(
        DOMAIN, SERVICE_REFRESH, _async_refresh, schema=REFRESH_SCHEMA
    )
