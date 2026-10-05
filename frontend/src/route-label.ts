type LabelConstructor = new (
  position: google.maps.LatLngLiteral,
  element: HTMLElement,
) => google.maps.OverlayView;

let RouteLabel: LabelConstructor | undefined;

/**
 * An HTML label pinned to a map position (like Google Maps' route bubbles).
 * Uses OverlayView because AdvancedMarkerElement requires a cloud map ID.
 * The class is created lazily: google.maps only exists after the API loaded.
 */
export function createRouteLabel(
  position: google.maps.LatLngLiteral,
  element: HTMLElement,
): google.maps.OverlayView {
  RouteLabel ??= class extends google.maps.OverlayView {
    private _position: google.maps.LatLngLiteral;
    private _element: HTMLElement;

    constructor(position: google.maps.LatLngLiteral, element: HTMLElement) {
      super();
      this._position = position;
      this._element = element;
    }

    onAdd(): void {
      this.getPanes()?.floatPane.append(this._element);
    }

    draw(): void {
      const point = this.getProjection()?.fromLatLngToDivPixel(this._position);
      if (point) {
        this._element.style.left = `${point.x}px`;
        this._element.style.top = `${point.y}px`;
      }
    }

    onRemove(): void {
      this._element.remove();
    }
  };
  return new RouteLabel(position, element);
}
