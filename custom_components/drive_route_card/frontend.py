"""Serve the bundled Lovelace card from the integration.

The card is built from /frontend into ./www and loaded on every dashboard via
`add_extra_js_url`, so users don't have to add a Lovelace resource manually.
"""

from __future__ import annotations

from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import CARD_FILENAME, DOMAIN, FRONTEND_URL_BASE, LOGGER

CARD_PATH = Path(__file__).parent / "www" / CARD_FILENAME


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

    url = f"{FRONTEND_URL_BASE}/{CARD_FILENAME}"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(url, str(CARD_PATH), cache_headers=True)]
    )
    integration = await async_get_integration(hass, DOMAIN)
    # Version query busts the browser cache after updates.
    add_extra_js_url(hass, f"{url}?v={integration.version}")
