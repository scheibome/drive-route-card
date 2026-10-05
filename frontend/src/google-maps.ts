const CALLBACK = "__driveRouteCardMapsLoaded";

let loader: Promise<void> | undefined;
let authFailed = false;
const authListeners = new Set<() => void>();

// Google calls this global when it rejects the key (invalid, wrong referrer,
// API not enabled, no billing). The exact reason only goes to the console.
const previousAuthFailure = (window as unknown as { gm_authFailure?: () => void }).gm_authFailure;
(window as unknown as { gm_authFailure: () => void }).gm_authFailure = () => {
  authFailed = true;
  authListeners.forEach((listener) => listener());
  previousAuthFailure?.();
};

/** Subscribe to key rejections; fires immediately if one already happened. Returns an unsubscribe function. */
export function onAuthFailure(listener: () => void): () => void {
  authListeners.add(listener);
  if (authFailed) listener();
  return () => authListeners.delete(listener);
}

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
