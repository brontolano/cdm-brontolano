// Adapter pembayaran pluggable. Kredensial dibaca dari ENV — TIDAK di-hardcode.
// Gateway nyata (Midtrans/Xendit) menyusul saat key tersedia; tanpa key → COD/manual.
//
// ENV yang diharapkan saat gateway diaktifkan:
//   PAYMENT_GATEWAY = none | midtrans | xendit   (default: none)
//   MIDTRANS_SERVER_KEY / XENDIT_SECRET_KEY      (jangan commit; isi di .env server)

export type GatewayName = 'none' | 'midtrans' | 'xendit';

export interface ChargeRequest {
  orderId: string;
  amount: number;
  method: 'qris' | 'va' | string;
  customer?: { nama?: string; no_wa?: string };
}
export interface ChargeResult {
  configured: boolean;            // false bila gateway belum disetel → fallback manual/WA
  status: 'pending' | 'unconfigured';
  gateway: GatewayName;
  instructions: string;          // teks untuk ditampilkan/diskirim via WA
  payload?: Record<string, unknown>; // qr string / VA number dari gateway nyata
}

function activeGateway(): GatewayName {
  const g = (process.env.PAYMENT_GATEWAY || 'none').toLowerCase();
  return g === 'midtrans' || g === 'xendit' ? g : 'none';
}

function hasKeys(g: GatewayName): boolean {
  if (g === 'midtrans') return !!process.env.MIDTRANS_SERVER_KEY;
  if (g === 'xendit') return !!process.env.XENDIT_SECRET_KEY;
  return false;
}

/**
 * Buat charge non-tunai. Saat ini stub aman: bila gateway/keys belum diset,
 * kembalikan `configured:false` agar alur jatuh ke konfirmasi manual via WhatsApp.
 * Tempat integrasi nyata: panggil SDK Midtrans/Xendit di cabang masing-masing.
 */
export async function createCharge(req: ChargeRequest): Promise<ChargeResult> {
  const gateway = activeGateway();
  if (gateway === 'none' || !hasKeys(gateway)) {
    return {
      configured: false,
      status: 'unconfigured',
      gateway,
      instructions: 'Pembayaran online belum diaktifkan. Admin akan kirim instruksi pembayaran via WhatsApp.',
    };
  }
  // TODO(gateway): integrasi nyata.
  //  midtrans: new midtransClient.CoreApi({ serverKey: process.env.MIDTRANS_SERVER_KEY }).charge({...})
  //  xendit:   axios.post('https://api.xendit.co/...', {...}, { auth: { username: process.env.XENDIT_SECRET_KEY, password: '' } })
  return {
    configured: true,
    status: 'pending',
    gateway,
    instructions: `Selesaikan pembayaran ${req.method.toUpperCase()} melalui ${gateway}.`,
  };
}
