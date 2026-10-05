import { decodePolyline, type LatLng } from "./polyline.ts";

export interface SketchLine {
  /** SVG path data in a viewBox of `width` x `height`. */
  d: string;
  fastest: boolean;
  start: [number, number];
  end: [number, number];
}

export interface Sketch {
  width: number;
  height: number;
  lines: SketchLine[];
}

const PADDING = 16;

/** Hand-drawn sample routes for when no route sensor exists yet (picker preview). */
const DEMO_PATHS: LatLng[][] = [
  [
    { lat: 0, lng: 0 },
    { lat: 0.3, lng: 0.4 },
    { lat: 0.35, lng: 1.2 },
    { lat: 0.8, lng: 1.6 },
    { lat: 1, lng: 2 },
  ],
  [
    { lat: 0, lng: 0 },
    { lat: -0.2, lng: 0.7 },
    { lat: 0.1, lng: 1.4 },
    { lat: 0.6, lng: 2.1 },
    { lat: 1, lng: 2 },
  ],
  [
    { lat: 0, lng: 0 },
    { lat: 0.6, lng: 0.2 },
    { lat: 1.1, lng: 0.9 },
    { lat: 1.2, lng: 1.6 },
    { lat: 1, lng: 2 },
  ],
];

/**
 * Project routes into an SVG viewBox (equirectangular, longitude scaled by
 * cos(latitude)) so their shape can be shown without a map provider.
 * The fastest route is listed last so it is drawn on top.
 */
export function buildSketch(
  polylines: string[] | undefined,
  fastestIndex: number,
  width: number,
  height: number,
): Sketch {
  const paths = polylines?.length
    ? polylines.map(decodePolyline)
    : DEMO_PATHS;
  const fastest = polylines?.length ? fastestIndex : 0;

  const points = paths.flat();
  if (!points.length) return { width, height, lines: [] };

  const meanLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const xScale = Math.cos((meanLat * Math.PI) / 180);
  const xs = points.map((p) => p.lng * xScale);
  const ys = points.map((p) => p.lat);
  const minX = Math.min(...xs);
  const maxY = Math.max(...ys);
  const spanX = Math.max(...xs) - minX || 1e-9;
  const spanY = maxY - Math.min(...ys) || 1e-9;
  const scale = Math.min((width - 2 * PADDING) / spanX, (height - 2 * PADDING) / spanY);
  const offsetX = (width - spanX * scale) / 2;
  const offsetY = (height - spanY * scale) / 2;

  const project = (p: LatLng): [number, number] => [
    Math.round((offsetX + (p.lng * xScale - minX) * scale) * 10) / 10,
    Math.round((offsetY + (maxY - p.lat) * scale) * 10) / 10,
  ];

  const lines = paths
    .map((path, index) => ({ coords: path.map(project), fastest: index === fastest }))
    .filter(({ coords }) => coords.length)
    .map(({ coords, fastest }) => ({
      d: `M${coords.map(([x, y]) => `${x},${y}`).join("L")}`,
      fastest,
      start: coords[0],
      end: coords[coords.length - 1],
    }));
  lines.sort((a, b) => Number(a.fastest) - Number(b.fastest));
  return { width, height, lines };
}
