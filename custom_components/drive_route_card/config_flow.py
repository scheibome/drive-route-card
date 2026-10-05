"""Config flow for Drive Route Card."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlowWithReload,
)
from homeassistant.const import CONF_API_KEY, CONF_NAME
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    BooleanSelector,
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
    TimeSelector,
)
import voluptuous as vol

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
    LOCATION_DOMAINS,
    LOGGER,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
    TRAVEL_MODE_DRIVE,
    TRAVEL_MODES,
    WEEKDAYS,
)
from .providers import (
    GoogleRoutesProvider,
    ProviderAuthError,
    ProviderError,
    RouteRequest,
)
from .util import resolve_coordinates

LOCATION_SELECTOR = EntitySelector(EntitySelectorConfig(domain=LOCATION_DOMAINS))
API_KEY_SELECTOR = TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD))

ROUTING_OPTIONS = (CONF_TRAVEL_MODE, CONF_AVOID_TOLLS, CONF_AVOID_HIGHWAYS)

ROUTING_SCHEMA = {
    vol.Required(CONF_TRAVEL_MODE): SelectSelector(
        SelectSelectorConfig(
            options=TRAVEL_MODES,
            translation_key=CONF_TRAVEL_MODE,
            mode=SelectSelectorMode.DROPDOWN,
        )
    ),
    vol.Required(CONF_AVOID_TOLLS): BooleanSelector(),
    vol.Required(CONF_AVOID_HIGHWAYS): BooleanSelector(),
}

USER_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_NAME): TextSelector(),
        vol.Required(CONF_API_KEY): API_KEY_SELECTOR,
        vol.Required(CONF_ORIGIN): LOCATION_SELECTOR,
        vol.Required(CONF_DESTINATION): LOCATION_SELECTOR,
        **ROUTING_SCHEMA,
    }
)

OPTIONS_SCHEMA = vol.Schema(
    {
        **ROUTING_SCHEMA,
        vol.Required(CONF_SCAN_INTERVAL): NumberSelector(
            NumberSelectorConfig(
                min=MIN_SCAN_INTERVAL,
                max=MAX_SCAN_INTERVAL,
                step=1,
                unit_of_measurement="min",
                mode=NumberSelectorMode.BOX,
            )
        ),
        vol.Required(CONF_WINDOW_ENABLED): BooleanSelector(),
        vol.Required(CONF_WINDOW_START): TimeSelector(),
        vol.Required(CONF_WINDOW_END): TimeSelector(),
        vol.Required(CONF_WEEKDAYS): SelectSelector(
            SelectSelectorConfig(
                options=WEEKDAYS,
                translation_key=CONF_WEEKDAYS,
                multiple=True,
                mode=SelectSelectorMode.LIST,
            )
        ),
    }
)


async def _async_validate_api_key(
    hass: HomeAssistant, api_key: str, origin: str, destination: str
) -> str | None:
    """Return an error key, or None if the key works or can't be tested yet.

    Persons/trackers may have no position right now; then the key is checked
    on the first update instead of blocking the flow.
    """
    origin_coordinates = resolve_coordinates(hass, origin)
    destination_coordinates = resolve_coordinates(hass, destination)
    if origin_coordinates is None or destination_coordinates is None:
        return None

    provider = GoogleRoutesProvider(async_get_clientsession(hass), api_key)
    try:
        await provider.async_compute_routes(
            RouteRequest(
                origin=origin_coordinates,
                destination=destination_coordinates,
                travel_mode=TRAVEL_MODE_DRIVE,
            )
        )
    except ProviderAuthError:
        return "invalid_auth"
    except ProviderError:
        return "cannot_connect"
    except Exception:
        LOGGER.exception("Unexpected error while validating the API key")
        return "unknown"
    return None


class DriveRouteConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Drive Route Card."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> DriveRouteOptionsFlow:
        """Return the options flow."""
        return DriveRouteOptionsFlow()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Set up one origin/destination pair."""
        errors: dict[str, str] = {}
        if user_input is not None:
            if user_input[CONF_ORIGIN] == user_input[CONF_DESTINATION]:
                errors["base"] = "same_location"
            elif error := await _async_validate_api_key(
                self.hass,
                user_input[CONF_API_KEY],
                user_input[CONF_ORIGIN],
                user_input[CONF_DESTINATION],
            ):
                errors["base"] = error
            else:
                return self.async_create_entry(
                    title=user_input[CONF_NAME],
                    data={
                        key: user_input[key]
                        for key in (CONF_API_KEY, CONF_ORIGIN, CONF_DESTINATION)
                    },
                    options={
                        **DEFAULT_OPTIONS,
                        **{key: user_input[key] for key in ROUTING_OPTIONS},
                    },
                )

        return self.async_show_form(
            step_id="user",
            data_schema=self.add_suggested_values_to_schema(
                USER_SCHEMA, user_input or DEFAULT_OPTIONS
            ),
            errors=errors,
        )

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> ConfigFlowResult:
        """Handle an invalid API key."""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Ask for a new API key."""
        errors: dict[str, str] = {}
        entry = self._get_reauth_entry()
        if user_input is not None:
            if not (
                error := await _async_validate_api_key(
                    self.hass,
                    user_input[CONF_API_KEY],
                    entry.data[CONF_ORIGIN],
                    entry.data[CONF_DESTINATION],
                )
            ):
                return self.async_update_reload_and_abort(
                    entry, data_updates={CONF_API_KEY: user_input[CONF_API_KEY]}
                )
            errors["base"] = error

        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=vol.Schema({vol.Required(CONF_API_KEY): API_KEY_SELECTOR}),
            errors=errors,
        )


class DriveRouteOptionsFlow(OptionsFlowWithReload):
    """Routing and polling options."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage the options."""
        if user_input is not None:
            user_input[CONF_SCAN_INTERVAL] = int(user_input[CONF_SCAN_INTERVAL])
            return self.async_create_entry(data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(
                OPTIONS_SCHEMA, {**DEFAULT_OPTIONS, **self.config_entry.options}
            ),
        )
