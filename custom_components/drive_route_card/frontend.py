"""Serve the bundled Lovelace card from the integration.

The card is built from /frontend into ./www and loaded on every dashboard, so
users don't have to add a Lovelace resource manually. Two mechanisms are used:

- `add_extra_js_url` puts the script into index.html. The frontend only reads
  that list when the page loads, so a page loaded while Home Assistant is still
  starting (before this integration is set up) never gets the card.
- A Lovelace resource (storage mode only) is loaded when the first dashboard
  opens, which covers that gap. Both use the same URL, so the browser loads the
  module once.
"""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import CARD_FILENAME, DOMAIN, FRONTEND_URL_BASE, LOGGER

if TYPE_CHECKING:
    from homeassistant.components.lovelace.resources import (
        ResourceStorageCollection,
    )

CARD_PATH = Path(__file__).parent / "www" / CARD_FILENAME
CARD_URL = f"{FRONTEND_URL_BASE}/{CARD_FILENAME}"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Register the static path and add the card to the frontend."""
    # Both are after_dependencies only, so they are absent in minimal setups
    # such as tests.
    if hass.http is None or "frontend" not in hass.config.components:
        return
    if not CARD_PATH.is_file():
        LOGGER.warning("Card bundle %s missing, run the frontend build", CARD_PATH)
        return

    # Imported lazily: both components are optional at import time.
    from homeassistant.components.frontend import add_extra_js_url  # noqa: PLC0415
    from homeassistant.components.http import StaticPathConfig  # noqa: PLC0415

    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(CARD_PATH), cache_headers=True)]
    )
    integration = await async_get_integration(hass, DOMAIN)
    # Version query busts the browser cache after updates.
    versioned_url = f"{CARD_URL}?v={integration.version}"
    add_extra_js_url(hass, versioned_url)
    await async_register_resource(hass, versioned_url)


def _storage_resources(hass: HomeAssistant) -> ResourceStorageCollection | None:
    """Return the Lovelace resource collection if it is stored in the UI."""
    if "lovelace" not in hass.config.components:
        return None
    # Imported lazily: lovelace is only an after_dependency.
    from homeassistant.components.lovelace.const import (  # noqa: PLC0415
        LOVELACE_DATA,
    )
    from homeassistant.components.lovelace.resources import (  # noqa: PLC0415
        ResourceStorageCollection,
    )

    lovelace = hass.data.get(LOVELACE_DATA)
    resources = lovelace.resources if lovelace else None
    # YAML resource mode: users manage resources themselves.
    return resources if isinstance(resources, ResourceStorageCollection) else None


def _is_card_url(url: str) -> bool:
    return url.split("?", 1)[0] == CARD_URL


async def async_register_resource(hass: HomeAssistant, versioned_url: str) -> None:
    """Add the card as Lovelace resource, or update its version."""
    resources = _storage_resources(hass)
    if resources is None:
        return
    # Loads the collection from storage; it starts empty until then.
    await resources.async_get_info()

    existing = [item for item in resources.async_items() if _is_card_url(item["url"])]
    if not existing:
        await resources.async_create_item({"res_type": "module", "url": versioned_url})
        return
    first, *duplicates = existing
    if first["url"] != versioned_url:
        await resources.async_update_item(
            first["id"], {"res_type": "module", "url": versioned_url}
        )
    for item in duplicates:
        await resources.async_delete_item(item["id"])


async def async_remove_resource(hass: HomeAssistant) -> None:
    """Remove the card's Lovelace resource."""
    resources = _storage_resources(hass)
    if resources is None:
        return
    await resources.async_get_info()
    for item in list(resources.async_items()):
        if _is_card_url(item["url"]):
            await resources.async_delete_item(item["id"])
