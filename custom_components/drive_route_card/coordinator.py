"""Polling coordinator for Drive Route Card."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .const import (
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
    LOGGER,
)
from .providers import (
    Coordinates,
    ProviderAuthError,
    ProviderError,
    Route,
    RouteProvider,
    RouteRequest,
)
from .util import is_within_window, resolve_coordinates

type DriveRouteConfigEntry = ConfigEntry[DriveRouteCoordinator]


@dataclass(frozen=True)
class DriveRouteData:
    """Result of the last successful route query."""

    routes: list[Route]
    origin: Coordinates
    destination: Coordinates
    travel_mode: str
    last_query: datetime

    @property
    def fastest_index(self) -> int | None:
        """Return the index of the route with the shortest duration."""
        if not self.routes:
            return None
        return min(range(len(self.routes)), key=lambda i: self.routes[i].duration)

    @property
    def slowest_index(self) -> int | None:
        """Return the index of the route with the longest duration."""
        if not self.routes:
            return None
        return max(range(len(self.routes)), key=lambda i: self.routes[i].duration)


class DriveRouteCoordinator(DataUpdateCoordinator[DriveRouteData]):
    """Fetch routes on an interval, optionally only inside a time window."""

    config_entry: DriveRouteConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        entry: DriveRouteConfigEntry,
        provider: RouteProvider,
    ) -> None:
        """Initialize the coordinator."""
        self.options = {**DEFAULT_OPTIONS, **entry.options}
        super().__init__(
            hass,
            LOGGER,
            config_entry=entry,
            name=f"{DOMAIN} {entry.title}",
            update_interval=timedelta(minutes=self.options[CONF_SCAN_INTERVAL]),
        )
        self.provider = provider
        self._force_next = False

    def _polling_allowed(self) -> bool:
        if not self.options[CONF_WINDOW_ENABLED]:
            return True
        start = dt_util.parse_time(self.options[CONF_WINDOW_START])
        end = dt_util.parse_time(self.options[CONF_WINDOW_END])
        if start is None or end is None:
            return True
        return is_within_window(dt_util.now(), start, end, self.options[CONF_WEEKDAYS])

    async def async_force_refresh(self) -> None:
        """Query the API now, ignoring the polling window."""
        self._force_next = True
        await self.async_refresh()

    async def _async_update_data(self) -> DriveRouteData:
        force, self._force_next = self._force_next, False
        # Outside the window keep the last result; the very first update
        # always queries so the sensors have a value after startup.
        if self.data is not None and not force and not self._polling_allowed():
            return self.data

        data = self.config_entry.data
        origin = resolve_coordinates(self.hass, data[CONF_ORIGIN])
        destination = resolve_coordinates(self.hass, data[CONF_DESTINATION])
        if origin is None or destination is None:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="location_unavailable",
                translation_placeholders={
                    "entity_id": data[CONF_ORIGIN]
                    if origin is None
                    else data[CONF_DESTINATION]
                },
            )

        request = RouteRequest(
            origin=origin,
            destination=destination,
            travel_mode=self.options[CONF_TRAVEL_MODE],
            avoid_tolls=self.options[CONF_AVOID_TOLLS],
            avoid_highways=self.options[CONF_AVOID_HIGHWAYS],
            language=self.hass.config.language,
        )
        try:
            routes = await self.provider.async_compute_routes(request)
        except ProviderAuthError as err:
            raise ConfigEntryAuthFailed(
                translation_domain=DOMAIN,
                translation_key="invalid_auth",
                translation_placeholders={"error": str(err)},
            ) from err
        except ProviderError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="update_failed",
                translation_placeholders={"error": str(err)},
            ) from err

        return DriveRouteData(
            routes=routes,
            origin=origin,
            destination=destination,
            travel_mode=request.travel_mode,
            last_query=dt_util.utcnow(),
        )
