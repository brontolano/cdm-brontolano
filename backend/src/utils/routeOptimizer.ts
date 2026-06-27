export interface RoutePoint {
  konsumen_id: string;
  nama_toko: string;
  latitude: number;
  longitude: number;
}

/** Haversine distance in kilometers between two GPS points. */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Nearest-neighbour TSP heuristic — free alternative to Google Directions.
 * Starts at the first point (or `start` if given) and repeatedly visits the
 * closest unvisited konsumen. Returns ordered points + total distance (km).
 */
export function optimizeRoute(
  points: RoutePoint[],
  start?: { lat: number; lng: number }
): { ordered: RoutePoint[]; totalKm: number } {
  const valid = points.filter((p) => p.latitude != null && p.longitude != null);
  if (valid.length <= 1) return { ordered: valid, totalKm: 0 };

  const remaining = [...valid];
  const ordered: RoutePoint[] = [];
  let current = start ?? { lat: valid[0].latitude, lng: valid[0].longitude };
  let totalKm = 0;

  while (remaining.length) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(current, { lat: remaining[i].latitude, lng: remaining[i].longitude });
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    if (ordered.length > 0 || start) totalKm += bestDist;
    ordered.push(next);
    current = { lat: next.latitude, lng: next.longitude };
  }

  return { ordered, totalKm: Math.round(totalKm * 100) / 100 };
}
