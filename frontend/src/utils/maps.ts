// Helper untuk membuka Google Maps (gratis, hanya URL — tanpa API key).

/** URL arah/directions Google Maps menuju satu titik GPS. */
export function gmapsDir(lat: number | string, lng: number | string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** URL lokasi (pin) Google Maps untuk satu titik. */
export function gmapsPin(lat: number | string, lng: number | string): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * URL arah Google Maps untuk beberapa titik berurutan (rute pengiriman).
 * Titik pertama = origin, titik terakhir = destination, sisanya = waypoints
 * (urutan sesuai hasil optimasi nearest-neighbour dari backend).
 */
export function gmapsRoute(points: { latitude: number | string; longitude: number | string }[]): string {
  const valid = points.filter((p) => p.latitude != null && p.longitude != null);
  if (valid.length === 0) return 'https://www.google.com/maps';
  if (valid.length === 1) return gmapsDir(valid[0].latitude, valid[0].longitude);
  const origin = `${valid[0].latitude},${valid[0].longitude}`;
  const destination = `${valid[valid.length - 1].latitude},${valid[valid.length - 1].longitude}`;
  const waypoints = valid
    .slice(1, -1)
    .map((p) => `${p.latitude},${p.longitude}`)
    .join('|');
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
  return url;
}
