import type { LatLng } from "./polyline.ts";

const MAX_SAMPLES = 150;

function sample(path: LatLng[], from = 0, to = 1): LatLng[] {
  const start = Math.floor(path.length * from);
  const end = Math.max(start + 1, Math.ceil(path.length * to));
  const slice = path.slice(start, end);
  const step = Math.max(1, Math.floor(slice.length / MAX_SAMPLES));
  return slice.filter((_, index) => index % step === 0);
}

function distanceSq(a: LatLng, b: LatLng): number {
  const dLat = a.lat - b.lat;
  const dLng = (a.lng - b.lng) * Math.cos((a.lat * Math.PI) / 180);
  return dLat * dLat + dLng * dLng;
}

/**
 * Pick one label position per route, like Google Maps does: the point in the
 * middle part of each route that is farthest away from all other routes, so
 * labels sit where the routes visibly differ and don't overlap.
 */
export function pickLabelPoints(paths: LatLng[][]): (LatLng | undefined)[] {
  const others = paths.map((_, index) =>
    paths.flatMap((path, other) => (other === index ? [] : sample(path))),
  );

  return paths.map((path, index) => {
    if (!path.length) return undefined;
    const candidates = sample(path, 0.2, 0.8);
    if (!others[index].length) {
      return path[Math.floor(path.length / 2)];
    }
    let best = candidates[0];
    let bestDistance = -1;
    for (const candidate of candidates) {
      let nearest = Infinity;
      for (const point of others[index]) {
        nearest = Math.min(nearest, distanceSq(candidate, point));
      }
      if (nearest > bestDistance) {
        bestDistance = nearest;
        best = candidate;
      }
    }
    return best;
  });
}
