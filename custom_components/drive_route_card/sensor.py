"""Travel time sensors for Drive Route Card."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import asdict, dataclass
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import UnitOfLength, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import CONF_DESTINATION, CONF_ORIGIN, DOMAIN, MAX_ROUTES
from .coordinator import DriveRouteConfigEntry, DriveRouteCoordinator, DriveRouteData
from .providers import Route

PARALLEL_UPDATES = 0

ATTR_ROUTES = "routes"


@dataclass(frozen=True, kw_only=True)
class DriveRouteSensorDescription(SensorEntityDescription):
    """Describes a Drive Route Card sensor."""

    route_fn: Callable[[DriveRouteData], int | None]
    value_fn: Callable[[Route], int]
    include_map_data: bool = False


DURATION_KWARGS: dict[str, Any] = {
    "device_class": SensorDeviceClass.DURATION,
    "state_class": SensorStateClass.MEASUREMENT,
    "native_unit_of_measurement": UnitOfTime.SECONDS,
    "suggested_unit_of_measurement": UnitOfTime.MINUTES,
    "suggested_display_precision": 0,
}


def _route_at(index: int) -> Callable[[DriveRouteData], int | None]:
    return lambda data: index if index < len(data.routes) else None


def _build_descriptions() -> list[DriveRouteSensorDescription]:
    # Fastest/slowest are meant for badges; fastest also feeds the card.
    descriptions = [
        DriveRouteSensorDescription(
            key="fastest_duration",
            translation_key="fastest_duration",
            route_fn=lambda data: data.fastest_index,
            value_fn=lambda route: route.duration,
            include_map_data=True,
            **DURATION_KWARGS,
        ),
        DriveRouteSensorDescription(
            key="slowest_duration",
            translation_key="slowest_duration",
            route_fn=lambda data: data.slowest_index,
            value_fn=lambda route: route.duration,
            **DURATION_KWARGS,
        ),
    ]
    for index in range(MAX_ROUTES):
        number = index + 1
        descriptions += [
            DriveRouteSensorDescription(
                key=f"route_{number}_duration",
                translation_key="route_duration",
                route_fn=_route_at(index),
                value_fn=lambda route: route.duration,
                **DURATION_KWARGS,
            ),
            DriveRouteSensorDescription(
                key=f"route_{number}_delay",
                translation_key="route_delay",
                route_fn=_route_at(index),
                value_fn=lambda route: route.delay,
                **DURATION_KWARGS,
            ),
            DriveRouteSensorDescription(
                key=f"route_{number}_distance",
                translation_key="route_distance",
                device_class=SensorDeviceClass.DISTANCE,
                state_class=SensorStateClass.MEASUREMENT,
                native_unit_of_measurement=UnitOfLength.METERS,
                suggested_unit_of_measurement=UnitOfLength.KILOMETERS,
                suggested_display_precision=1,
                route_fn=_route_at(index),
                value_fn=lambda route: route.distance,
            ),
        ]
    return descriptions


SENSOR_DESCRIPTIONS = _build_descriptions()


async def async_setup_entry(
    hass: HomeAssistant,
    entry: DriveRouteConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up sensors for one origin/destination pair."""
    coordinator = entry.runtime_data
    async_add_entities(
        DriveRouteSensor(coordinator, description)
        for description in SENSOR_DESCRIPTIONS
    )


def _route_number(description: DriveRouteSensorDescription) -> str | None:
    """Return '1'..'3' for per-route sensors."""
    parts = description.key.split("_")
    return parts[1] if parts[0] == "route" else None


class DriveRouteSensor(CoordinatorEntity[DriveRouteCoordinator], SensorEntity):
    """A travel time or distance sensor."""

    entity_description: DriveRouteSensorDescription
    _attr_has_entity_name = True
    # Polylines change every query and would bloat the recorder database.
    _unrecorded_attributes = frozenset({ATTR_ROUTES, "origin", "destination"})

    def __init__(
        self,
        coordinator: DriveRouteCoordinator,
        description: DriveRouteSensorDescription,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        entry = coordinator.config_entry
        self._attr_unique_id = f"{entry.entry_id}_{description.key}"
        if (number := _route_number(description)) is not None:
            self._attr_translation_placeholders = {"route": number}
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.title,
            entry_type=DeviceEntryType.SERVICE,
            manufacturer="Google Maps Platform",
            model="Routes API",
        )

    @property
    def _route_index(self) -> int | None:
        return self.entity_description.route_fn(self.coordinator.data)

    @property
    def native_value(self) -> int | None:
        """Return the sensor value."""
        if (index := self._route_index) is None:
            return None
        return self.entity_description.value_fn(self.coordinator.data.routes[index])

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return route details; the fastest sensor also carries map data."""
        data = self.coordinator.data
        if (index := self._route_index) is None:
            return None
        route = data.routes[index]
        attributes: dict[str, Any] = {
            "route": index + 1,
            "description": route.description,
            "last_query": data.last_query.isoformat(),
        }
        if self.entity_description.include_map_data:
            entry_data = self.coordinator.config_entry.data
            attributes |= {
                "travel_mode": data.travel_mode,
                "origin_entity": entry_data[CONF_ORIGIN],
                "destination_entity": entry_data[CONF_DESTINATION],
                "origin": asdict(data.origin),
                "destination": asdict(data.destination),
                ATTR_ROUTES: [
                    {
                        "duration": item.duration,
                        "static_duration": item.static_duration,
                        "delay": item.delay,
                        "distance": item.distance,
                        "description": item.description,
                        "polyline": item.polyline,
                    }
                    for item in data.routes
                ],
            }
        return attributes
