const CALLBACK = "__driveRouteCardMapsLoaded";

let loader: Promise<void> | undefined;

/**
 * Load the Maps JavaScript API once per page. Other cards may already have
 * loaded it; in that case the existing instance is reused.
 */
export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof google !== "undefined" && typeof google.maps?.importLibrary === "function") {
    return Promise.resolve();
  }
  loader ??= new Promise<void>((resolve, reject) => {
    (window as unknown as Record<string, () => void>)[CALLBACK] = () => resolve();
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      loading: "async",
      callback: CALLBACK,
      v: "weekly",
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => {
      loader = undefined;
      script.remove();
      reject(new Error("Failed to load the Google Maps JavaScript API"));
    };
    document.head.append(script);
  });
  return loader;
}
