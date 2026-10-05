"""Tests for the Google Routes provider."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
import pytest
from pytest_homeassistant_custom_component.test_util.aiohttp import (
    AiohttpClientMocker,
)

from custom_components.drive_route_card.providers import (
    Coordinates,
    GoogleRoutesProvider,
    ProviderAuthError,
    ProviderError,
    Route,
    RouteRequest,
)
from custom_components.drive_route_card.providers.google import (
    API_URL,
    build_request_body,
)

REQUEST = RouteRequest(
    origin=Coordinates(48.1, 11.5),
    destination=Coordinates(48.3, 11.7),
    travel_mode="drive",
    avoid_tolls=True,
    language="de",
)


def _provider(hass: HomeAssistant) -> GoogleRoutesProvider:
    return GoogleRoutesProvider(async_get_clientsession(hass), "test-key")


async def test_compute_routes(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker
) -> None:
    """Routes are parsed and limited to three."""
    route = {
        "duration": "1500s",
        "staticDuration": "1200s",
        "distanceMeters": 20500,
        "polyline": {"encodedPolyline": "abc"},
        "description": "A9",
    }
    aioclient_mock.post(
        API_URL, json={"routes": [route, {"duration": "60s"}, route, route]}
    )

    routes = await _provider(hass).async_compute_routes(REQUEST)

    assert routes[0] == Route(1500, 1200, 20500, "abc", "A9")
    assert routes[0].delay == 300
    # Missing fields fall back to sane defaults.
    assert routes[1] == Route(60, 60, 0, "", None)
    assert len(routes) == 3

    _, _, body, headers = aioclient_mock.mock_calls[0]
    assert headers["X-Goog-Api-Key"] == "test-key"
    assert body["computeAlternativeRoutes"] is True
    assert body["routingPreference"] == "TRAFFIC_AWARE"
    assert body["routeModifiers"] == {"avoidTolls": True, "avoidHighways": False}
    assert body["languageCode"] == "de"


def test_non_traffic_modes_omit_traffic_options() -> None:
    """Bicycle and walking requests must not contain traffic settings."""
    body = build_request_body(
        RouteRequest(REQUEST.origin, REQUEST.destination, "bicycle", avoid_tolls=True)
    )
    assert body["travelMode"] == "BICYCLE"
    assert "routingPreference" not in body
    assert "routeModifiers" not in body


@pytest.mark.parametrize(
    ("status", "payload", "error"),
    [
        (403, {"error": {"message": "denied"}}, ProviderAuthError),
        (
            400,
            {
                "error": {
                    "message": "bad key",
                    "details": [{"reason": "API_KEY_INVALID"}],
                }
            },
            ProviderAuthError,
        ),
        (400, {"error": {"message": "bad request"}}, ProviderError),
        (500, {}, ProviderError),
    ],
)
async def test_errors(
    hass: HomeAssistant,
    aioclient_mock: AiohttpClientMocker,
    status: int,
    payload: dict,
    error: type[Exception],
) -> None:
    """HTTP errors map to provider exceptions."""
    aioclient_mock.post(API_URL, status=status, json=payload)
    with pytest.raises(error):
        await _provider(hass).async_compute_routes(REQUEST)
