import { describe, it, expect } from 'vitest';
import { haversineKm, optimizeRoute } from './routeOptimizer';

describe('haversineKm', () => {
  it('jarak dua titik wajar (Soreang ~ beberapa km)', () => {
    const d = haversineKm({ lat: -7.0289, lng: 107.5198 }, { lat: -7.0102, lng: 107.5401 });
    expect(d).toBeGreaterThan(2);
    expect(d).toBeLessThan(5);
  });
  it('jarak titik sama = 0', () => {
    expect(haversineKm({ lat: -7, lng: 107 }, { lat: -7, lng: 107 })).toBe(0);
  });
});

describe('optimizeRoute (nearest-neighbour)', () => {
  const pts = [
    { konsumen_id: 'a', nama_toko: 'A', latitude: -7.0, longitude: 107.0 },
    { konsumen_id: 'b', nama_toko: 'B', latitude: -7.0, longitude: 107.3 },
    { konsumen_id: 'c', nama_toko: 'C', latitude: -7.0, longitude: 107.1 },
  ];
  it('mengurutkan dari titik awal ke terdekat', () => {
    const { ordered, totalKm } = optimizeRoute(pts);
    expect(ordered.map((p) => p.konsumen_id)).toEqual(['a', 'c', 'b']); // 107.0 -> 107.1 -> 107.3
    expect(totalKm).toBeGreaterThan(0);
  });
  it('1 titik -> jarak 0', () => {
    expect(optimizeRoute([pts[0]]).totalKm).toBe(0);
  });
});
