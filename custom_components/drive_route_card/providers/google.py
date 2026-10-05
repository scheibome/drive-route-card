"""Google Maps Platform Routes API provider.

Docs: https://developers.google.com/maps/documentation/routes/compute_route_directions
"""

from __future__ import annotations

from http import HTTPStatus
from typing import Any

import aiohttp

from ..const import MAX_ROUTES, TRAFFIC_AWARE_MODES
from .base import (
    Coordinates,
    ProviderAuthError,
    ProviderError,
    Route,
    RouteProvider,
    RouteRequest,
)

API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes"

# Billing depends on the requested fields, so only ask for what we use.
FIELD_MASK = ",".join(
    [
        "routes.duration",
        "routes.staticDuration",
        "routes.distanceMeters",
        "routes.polyline.encodedPolyline",
        "routes.description",
    ]
)

TRAVEL_MODE_MAP = {
    "drive": "DRIVE",
    "two_wheeler": "TWO_WHEELER",
    "bicycle": "BICYCLE",
    "walk": "WALK",
}

REQUEST_TIMEOUT = aiohttp.ClientTimeout(total=30)


def _waypoint(coordinates: Coordinates) -> dict[str, Any]:
    return {
        "location": {
            "latLng": {
                "latitude": coordinates.latitude,
                "longitude": coordinates.longitude,
            }
        }
    }


def _parse_duration(value: str | None) -> int | None:
    """Parse a protobuf duration like '1234s'."""
    if not value:
        return None
    return round(float(value.rstrip("s")))


def _parse_route(data: dict[str, Any]) -> Route:
    duration = _parse_duration(data.get("duration")) or 0
    static_duration = _parse_duration(data.get("staticDuration"))
    return Route(
        duration=duration,
        static_duration=duration if static_duration is None else static_duration,
        distance=int(data.get("distanceMeters", 0)),
        polyline=data.get("polyline", {}).get("encodedPolyline", ""),
        description=data.get("description") or None,
    )


def build_request_body(request: RouteRequest) -> dict[str, Any]:
    """Build the computeRoutes JSON body."""
    body: dict[str, Any] = {
        "origin": _waypoint(request.origin),
        "destination": _waypoint(request.destination),
        "travelMode": TRAVEL_MODE_MAP[request.travel_mode],
        "computeAlternativeRoutes": True,
        "units": "METRIC",
    }
    if request.travel_mode in TRAFFIC_AWARE_MODES:
        # routingPreference and these modifiers are rejected for other modes.
        body["routingPreference"] = "TRAFFIC_AWARE"
        body["routeModifiers"] = {
            "avoidTolls": request.avoid_tolls,
            "avoidHighways": request.avoid_highways,
        }
    if request.language:
        body["languageCode"] = request.language
    return body


class GoogleRoutesProvider(RouteProvider):
    """Compute routes with the Google Routes API."""

    def __init__(self, session: aiohttp.ClientSession, api_key: str) -> None:
        """Initialize the provider."""
        self._session = session
        self._api_key = api_key

    async def async_compute_routes(self, request: RouteRequest) -> list[Route]:
        """Compute the main route plus alternatives."""
        headers = {
            "X-Goog-Api-Key": self._api_key,
            "X-Goog-FieldMask": FIELD_MASK,
        }
        try:
            async with self._session.post(
                API_URL,
                json=build_request_body(request),
                headers=headers,
                timeout=REQUEST_TIMEOUT,
            ) as response:
                status = response.status
                payload = await response.json(content_type=None)
        except (aiohttp.ClientError, TimeoutError, ValueError) as err:
            raise ProviderError(f"Error talking to Google Routes API: {err}") from err

        if status != HTTPStatus.OK:
            error = (payload or {}).get("error", {})
            message = error.get("message", f"HTTP {status}")
            if status in (HTTPStatus.UNAUTHORIZED, HTTPStatus.FORBIDDEN) or (
                "API_KEY_INVALID" in str(error.get("details", ""))
            ):
                raise ProviderAuthError(message)
            raise ProviderError(message)

        routes = (payload or {}).get("routes", [])
        return [_parse_route(route) for route in routes[:MAX_ROUTES]]
