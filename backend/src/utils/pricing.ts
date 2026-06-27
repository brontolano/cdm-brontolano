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
