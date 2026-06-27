// Cetak struk thermal 58mm — buka window baru dengan CSS print khusus lalu print().
import { rupiah } from '../components/ui';

export interface ReceiptItem {
  nama: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}
export interface ReceiptData {
  nomor: string;
  tanggal?: string;
  kepada?: string;
  catatan?: string;
  items: ReceiptItem[];
  total: number;
  dibayar?: number | null;
  statusBayar?: string | null;
}

const esc = (s: string) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export function printThermalReceipt(d: ReceiptData) {
  const rows = d.items
    .map(
      (it) => `
      <div class="item">
        <div class="nm">${esc(it.nama)}</div>
        <div class="ln"><span>${it.jumlah} x ${rupiah(it.harga)}</span><span>${rupiah(it.subtotal)}</span></div>
      </div>`
    )
    .join('');

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Struk ${esc(d.nomor)}</title>
  <style>
    @page { size: 58mm auto; margin: 0; }
    * { box-sizing: border-box; }
    body { width: 58mm; margin: 0; padding: 4mm 3mm; font-family: 'Courier New', monospace; font-size: 11px; color: #000; }
    .c { text-align: center; }
    .b { font-weight: bold; }
    .big { font-size: 14px; }
    hr { border: none; border-top: 1px dashed #000; margin: 5px 0; }
    .item { margin-bottom: 3px; }
    .nm { word-break: break-word; }
    .ln { display: flex; justify-content: space-between; }
    .tot { display: flex; justify-content: space-between; font-weight: bold; }
    .sm { font-size: 10px; }
  </style></head><body>
    <div class="c b big">BRONTOLANO</div>
    <div class="c sm">PT Rojo Brontolano · Grosir Sembako</div>
    <hr>
    <div>No : ${esc(d.nomor)}</div>
    ${d.tanggal ? `<div>Tgl: ${esc(d.tanggal)}</div>` : ''}
    ${d.kepada ? `<div>Kpd: ${esc(d.kepada)}</div>` : ''}
    <hr>
    ${rows}
    <hr>
    <div class="tot"><span>TOTAL</span><span>${rupiah(d.total)}</span></div>
    ${d.dibayar != null ? `<div class="ln"><span>Bayar</span><span>${rupiah(d.dibayar)}</span></div>` : ''}
    ${d.statusBayar ? `<div class="ln"><span>Status</span><span class="b">${esc(d.statusBayar.toUpperCase())}</span></div>` : ''}
    ${d.catatan ? `<div class="sm">Catatan: ${esc(d.catatan)}</div>` : ''}
    <hr>
    <div class="c sm">Terima kasih atas pesanan Anda</div>
    <div class="c sm">~ Brontolano ~</div>
    <script>window.onload=function(){window.print();setTimeout(function(){window.close();},300);};</script>
  </body></html>`;

  const w = window.open('', '_blank', 'width=320,height=640');
  if (!w) {
    alert('Pop-up diblokir. Izinkan pop-up untuk mencetak struk.');
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
