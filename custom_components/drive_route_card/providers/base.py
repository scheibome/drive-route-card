"""Provider-agnostic routing types.

Every routing backend (Google, HERE, TomTom, OSRM, ...) implements
`RouteProvider` and returns `Route` objects, so the coordinator, sensors
and card never depend on a specific API.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass


class ProviderError(Exception):
    """Routing request failed."""


class ProviderAuthError(ProviderError):
    """API key is missing, invalid or lacks permissions."""


@dataclass(frozen=True)
class Coordinates:
    """A WGS84 position."""

    latitude: float
    longitude: float


@dataclass(frozen=True)
class RouteRequest:
    """Parameters for a single route computation."""

    origin: Coordinates
    destination: Coordinates
    travel_mode: str
    avoid_tolls: bool = False
    avoid_highways: bool = False
    language: str | None = None


@dataclass(frozen=True)
class Route:
    """One computed route."""

    duration: int  # seconds, including traffic where supported
    static_duration: int  # seconds, without traffic
    distance: int  # meters
    polyline: str  # Google encoded polyline format (precision 5)
    description: str | None = None

    @property
    def delay(self) -> int:
        """Return the traffic delay in seconds."""
        return max(0, self.duration - self.static_duration)


class RouteProvider(ABC):
    """Base class for routing backends."""

    @abstractmethod
    async def async_compute_routes(self, request: RouteRequest) -> list[Route]:
        """Return the main route followed by alternatives, best first.

        Raise ProviderAuthError for credential problems and ProviderError
        for everything else.
        """
