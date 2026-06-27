// Harga grosir berjenjang (sisi frontend) — cermin dari backend.
export interface Tiers {
  harga_het?: number | string | null;
  harga_s1?: number | string | null;
  harga_s2?: number | string | null;
  harga_s3?: number | string | null;
  harga_s4?: number | string | null;
  harga_jual?: number | string | null;
}

function n(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const x = Number(v);
  return Number.isFinite(x) ? x : null;
}

/** Pilih harga sesuai jumlah beli (1-5 HET, 6-9 S1, 10-24 S2, 25-150 S3, >150 S4). */
export function priceForQty(b: Tiers, qty: number): number {
  const het = n(b.harga_het), s1 = n(b.harga_s1), s2 = n(b.harga_s2), s3 = n(b.harga_s3), s4 = n(b.harga_s4);
  const fallback = n(b.harga_jual) ?? het ?? s1 ?? s2 ?? s3 ?? s4 ?? 0;
  let chosen: number | null;
  if (qty >= 151) chosen = s4;
  else if (qty >= 25) chosen = s3;
  else if (qty >= 10) chosen = s2;
  else if (qty >= 6) chosen = s1;
  else chosen = het;
  return chosen ?? s4 ?? s3 ?? s2 ?? s1 ?? het ?? fallback;
}

/** Harga mulai (tier terendah/termurah yang ada) untuk ditampilkan di kartu produk. */
export function hargaMulai(b: Tiers): number {
  return priceForQty(b, 1);
}

/** Info tier untuk jumlah (karton) tertentu: kode + rentang qty. */
export function tierInfo(qty: number): { key: string; range: string } {
  if (qty >= 151) return { key: 'S4', range: '>150' };
  if (qty >= 25) return { key: 'S3', range: '25–150' };
  if (qty >= 10) return { key: 'S2', range: '10–24' };
  if (qty >= 6) return { key: 'S1', range: '6–9' };
  return { key: 'HET', range: '1–5' };
}

const rpFmt = (v: number) => 'Rp' + Math.round(v).toLocaleString('id-ID');

/** Deteksi anomali harga strata (mode peringatan). Kosong = wajar. */
export function detectTierAnomalies(b: Tiers & { hpp?: number | string | null }): string[] {
  const issues: string[] = [];
  const tiers = [
    { label: 'HET', v: n(b.harga_het) }, { label: 'S1', v: n(b.harga_s1) }, { label: 'S2', v: n(b.harga_s2) },
    { label: 'S3', v: n(b.harga_s3) }, { label: 'S4', v: n(b.harga_s4) },
  ].filter((t) => t.v != null) as { label: string; v: number }[];
  for (let i = 1; i < tiers.length; i++) {
    if (tiers[i].v > tiers[i - 1].v + 0.5)
      issues.push(`${tiers[i].label} (${rpFmt(tiers[i].v)}) lebih mahal dari ${tiers[i - 1].label} — strata terbalik`);
  }
  const het = n(b.harga_het);
  if (het && het > 0) for (const t of tiers) if (t.label !== 'HET' && t.v > het * 2)
    issues.push(`${t.label} (${rpFmt(t.v)}) ~${(t.v / het).toFixed(1)}× HET — kemungkinan salah ketik`);
  const hpp = n(b.hpp);
  if (hpp && hpp > 0) for (const t of tiers) if (t.v < hpp)
    issues.push(`${t.label} (${rpFmt(t.v)}) di bawah HPP — jual rugi`);
  return issues;
}

export interface GeneratedTiers {
  harga_het: number;
  harga_s1: number;
  harga_s2: number;
  harga_s3: number;
  harga_s4: number;
}

/**
 * Auto-generate 5 strata harga dari HPP berdasarkan margin pasar grosir.
 * Margin turun bertahap (linear) dari `marginHet`% (qty kecil) ke `marginFloor`% (partai besar).
 * Hasil dibulatkan ke `round` terdekat (default 100) agar harga rapi.
 * Default 15% → 10% sesuai riset margin grosir sembako (10–25%) & spread Brontolano (~4,3%).
 */
export function tiersFromHpp(hpp: number, marginHet = 15, marginFloor = 10, round = 100): GeneratedTiers {
  const margins = [0, 1, 2, 3, 4].map((i) => marginHet + ((marginFloor - marginHet) * i) / 4);
  const price = (m: number) => {
    const raw = hpp * (1 + m / 100);
    return round > 0 ? Math.round(raw / round) * round : Math.round(raw);
  };
  return {
    harga_het: price(margins[0]),
    harga_s1: price(margins[1]),
    harga_s2: price(margins[2]),
    harga_s3: price(margins[3]),
    harga_s4: price(margins[4]),
  };
}
