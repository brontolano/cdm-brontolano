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
