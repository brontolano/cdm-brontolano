import { MobilePage } from '../lapangan/shell';

// Stub — diimplementasikan penuh di issue #19 (barang keluar manual).
export default function GudangKeluar() {
  return (
    <MobilePage title="Barang Keluar" back="/gudang" color="#c2410c">
      <p style={{ color: '#64748b' }}>Input barang keluar manual sedang disiapkan (#19).</p>
    </MobilePage>
  );
}
