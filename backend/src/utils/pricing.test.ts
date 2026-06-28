import { describe, it, expect } from 'vitest';
import { priceForQty, tiersFromHpp, detectTierAnomalies, parseRupiah } from './pricing';

const B = { harga_het: 244757, harga_s1: 242361, harga_s2: 239940, harga_s3: 237495, harga_s4: 235000 };

describe('priceForQty (tier grosir)', () => {
  it('memilih tier sesuai jumlah', () => {
    expect(priceForQty(B, 3)).toBe(244757); // HET 1-4
    expect(priceForQty(B, 7)).toBe(242361); // S1 5-9
    expect(priceForQty(B, 10)).toBe(239940); // S2 10-24
    expect(priceForQty(B, 30)).toBe(237495); // S3 25-49
    expect(priceForQty(B, 200)).toBe(235000); // S4 >=50
  });
  it('fallback ke tier terisi bila tier terpilih kosong', () => {
    expect(priceForQty({ harga_het: 1000 }, 50)).toBe(1000); // S3 null -> mundur
    expect(priceForQty({ harga_jual: 500 }, 1)).toBe(500); // pakai harga_jual
  });
  it('0 bila tak ada harga sama sekali', () => {
    expect(priceForQty({}, 1)).toBe(0);
  });
});

describe('tiersFromHpp (auto-generate)', () => {
  it('margin turun HET->S4 dan dibulatkan', () => {
    const t = tiersFromHpp(10000);
    expect(t.harga_het).toBe(11500); // +15%
    expect(t.harga_s4).toBe(11000); // +10%
    expect(t.harga_het).toBeGreaterThan(t.harga_s4);
  });
  it('menghormati batas HET', () => {
    const t = tiersFromHpp(14000, 15, 10, 100, 15700);
    expect(t.harga_het).toBeLessThanOrEqual(15700);
  });
});

describe('detectTierAnomalies', () => {
  it('strata normal tidak diberi peringatan', () => {
    expect(detectTierAnomalies(B)).toHaveLength(0);
  });
  it('mendeteksi strata terbalik', () => {
    const r = detectTierAnomalies({ harga_het: 5000, harga_s1: 5200 });
    expect(r.join(' ')).toMatch(/terbalik/);
  });
  it('mendeteksi lonjakan >2x HET (salah ketik)', () => {
    const r = detectTierAnomalies({ harga_het: 211888, harga_s1: 2119705 });
    expect(r.join(' ')).toMatch(/salah ketik|kali|HET/i);
  });
  it('mendeteksi harga di bawah HPP', () => {
    const r = detectTierAnomalies({ hpp: 10000, harga_het: 9000 });
    expect(r.join(' ')).toMatch(/HPP|rugi/);
  });
  it('mendeteksi harga di atas batas HET', () => {
    const r = detectTierAnomalies({ batas_het: 15700, harga_het: 16100 });
    expect(r.join(' ')).toMatch(/batas HET/);
  });
});

describe('parseRupiah', () => {
  it('membaca format rupiah Indonesia', () => {
    expect(parseRupiah('Rp 211.888')).toBe(211888);
    expect(parseRupiah('2.119.705')).toBe(2119705);
    expect(parseRupiah('Rp 1.234,50')).toBe(1234.5);
    expect(parseRupiah('')).toBeNull();
    expect(parseRupiah(null)).toBeNull();
    expect(parseRupiah(5000)).toBe(5000);
  });
});
