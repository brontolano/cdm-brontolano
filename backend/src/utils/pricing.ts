// Harga grosir berjenjang (tiered wholesale pricing) ala Brontolano.

export interface TierPrices {
  harga_het?: number | null; // 1-5
  harga_s1?: number | null;  // 6-9
  harga_s2?: number | null;  // 10-24
  harga_s3?: number | null;  // 25-150
  harga_s4?: number | null;  // >150
  harga_jual?: number | string | null; // fallback satuan
}

/** Pilih harga sesuai jumlah beli. Jika tier kosong, mundur ke tier terendah yang ada. */
export function priceForQty(b: TierPrices, qty: number): number {
  const het = num(b.harga_het);
  const s1 = num(b.harga_s1);
  const s2 = num(b.harga_s2);
  const s3 = num(b.harga_s3);
  const s4 = num(b.harga_s4);
  const fallback = num(b.harga_jual) ?? het ?? s1 ?? s2 ?? s3 ?? s4 ?? 0;

  let chosen: number | null = null;
  if (qty >= 151) chosen = s4;
  else if (qty >= 25) chosen = s3;
  else if (qty >= 10) chosen = s2;
  else if (qty >= 6) chosen = s1;
  else chosen = het;

  // Jika tier yang dipilih kosong, cari tier terdekat yang terisi (dari atas ke bawah).
  return chosen ?? s4 ?? s3 ?? s2 ?? s1 ?? het ?? fallback;
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

const rp = (v: number) => 'Rp' + Math.round(v).toLocaleString('id-ID');

/**
 * Deteksi anomali harga strata (mode peringatan).
 * Mengembalikan daftar pesan masalah; kosong = data wajar.
 * Aturan: strata harus menurun (qty banyak = murah), tak ada lonjakan tak wajar (>2x HET),
 * dan tak ada harga di bawah HPP (jual rugi).
 */
export function detectTierAnomalies(b: TierPrices & { hpp?: number | string | null }): string[] {
  const issues: string[] = [];
  const tiers = [
    { label: 'HET', v: num(b.harga_het) },
    { label: 'S1', v: num(b.harga_s1) },
    { label: 'S2', v: num(b.harga_s2) },
    { label: 'S3', v: num(b.harga_s3) },
    { label: 'S4', v: num(b.harga_s4) },
  ].filter((t) => t.v != null) as { label: string; v: number }[];

  // 1) Strata harus menurun (atau sama) — tier berikut tidak boleh lebih mahal
  for (let i = 1; i < tiers.length; i++) {
    if (tiers[i].v > tiers[i - 1].v + 0.5) {
      issues.push(`${tiers[i].label} (${rp(tiers[i].v)}) lebih mahal dari ${tiers[i - 1].label} (${rp(tiers[i - 1].v)}) — strata terbalik`);
    }
  }
  // 2) Lonjakan tak wajar (>2x HET) — biasanya salah ketik (kelebihan nol)
  const het = num(b.harga_het);
  if (het && het > 0) {
    for (const t of tiers) {
      if (t.label !== 'HET' && t.v > het * 2) {
        issues.push(`${t.label} (${rp(t.v)}) ~${(t.v / het).toFixed(1)}× HET — kemungkinan salah ketik`);
      }
    }
  }
  // 3) Harga di bawah HPP — jual rugi
  const hpp = num(b.hpp);
  if (hpp && hpp > 0) {
    for (const t of tiers) {
      if (t.v < hpp) issues.push(`${t.label} (${rp(t.v)}) di bawah HPP (${rp(hpp)}) — jual rugi`);
    }
  }
  return issues;
}

/** Ubah "Rp 211.888" / "2.119.705" / "Rp 1.234,50" → number. */
export function parseRupiah(s: string | number | null | undefined): number | null {
  if (s === null || s === undefined || s === '') return null;
  if (typeof s === 'number') return s;
  let t = String(s).replace(/rp/i, '').trim();
  // Buang pemisah ribuan titik; ubah koma desimal jadi titik.
  t = t.replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
