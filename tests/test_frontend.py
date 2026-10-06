"""Tests for registering the card as Lovelace resource."""

from __future__ import annotations

from unittest.mock import MagicMock

from homeassistant.components.lovelace.const import LOVELACE_DATA
from homeassistant.components.lovelace.resources import (
    ResourceStorageCollection,
    ResourceYAMLCollection,
)
from homeassistant.core import HomeAssistant
import pytest

from custom_components.drive_route_card.frontend import (
    CARD_URL,
    async_register_resource,
    async_remove_resource,
)

URL_V1 = f"{CARD_URL}?v=0.1.0"
URL_V2 = f"{CARD_URL}?v=0.2.0"
OTHER_URL = "/hacsfiles/other-card/other-card.js"


@pytest.fixture
def resources(hass: HomeAssistant) -> ResourceStorageCollection:
    """Provide Lovelace with resources in storage mode."""
    collection = ResourceStorageCollection(hass, MagicMock())
    hass.data[LOVELACE_DATA] = MagicMock(resources=collection)
    hass.config.components.add("lovelace")
    return collection


def _urls(resources: ResourceStorageCollection) -> list[str]:
    return [item["url"] for item in resources.async_items()]


async def test_register_creates_resource(
    hass: HomeAssistant, resources: ResourceStorageCollection
) -> None:
    """The card is added as module resource next to existing ones."""
    await resources.async_get_info()
    await resources.async_create_item({"res_type": "module", "url": OTHER_URL})

    await async_register_resource(hass, URL_V1)

    assert _urls(resources) == [OTHER_URL, URL_V1]
    assert resources.async_items()[1]["type"] == "module"


async def test_register_updates_version_and_drops_duplicates(
    hass: HomeAssistant, resources: ResourceStorageCollection
) -> None:
    """An old version is updated in place and duplicates are removed."""
    await resources.async_get_info()
    for url in (URL_V1, OTHER_URL, URL_V1):
        await resources.async_create_item({"res_type": "module", "url": url})

    await async_register_resource(hass, URL_V2)

    assert _urls(resources) == [URL_V2, OTHER_URL]


async def test_register_is_idempotent(
    hass: HomeAssistant, resources: ResourceStorageCollection
) -> None:
    """Registering the current version again changes nothing."""
    await async_register_resource(hass, URL_V1)
    await async_register_resource(hass, URL_V1)

    assert _urls(resources) == [URL_V1]


async def test_remove_resource(
    hass: HomeAssistant, resources: ResourceStorageCollection
) -> None:
    """Only the card's resource is removed."""
    await resources.async_get_info()
    await resources.async_create_item({"res_type": "module", "url": OTHER_URL})
    await async_register_resource(hass, URL_V1)

    await async_remove_resource(hass)

    assert _urls(resources) == [OTHER_URL]


async def test_yaml_mode_is_left_alone(hass: HomeAssistant) -> None:
    """Resources managed in YAML are not touched."""
    yaml_resources = ResourceYAMLCollection([])
    hass.data[LOVELACE_DATA] = MagicMock(resources=yaml_resources)
    hass.config.components.add("lovelace")

    await async_register_resource(hass, URL_V1)

    assert yaml_resources.async_items() == []


async def test_removing_last_entry_removes_resource(
    hass: HomeAssistant,
    setup_entry,
    resources: ResourceStorageCollection,
) -> None:
    """The resource goes away with the last config entry."""
    await async_register_resource(hass, URL_V1)

    assert await hass.config_entries.async_remove(setup_entry.entry_id)

    assert _urls(resources) == []
