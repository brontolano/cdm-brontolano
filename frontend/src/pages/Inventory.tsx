import { useEffect, useState } from 'react';
import { Plus, Upload, Download } from 'lucide-react';
import { api, apiError } from '../api/client';
import { useAuth } from '../store/auth';
import { useToast } from '../store/toast';
import { Modal, Spinner, EmptyState, rupiah } from '../components/ui';
import { fileToCompressedDataUrl } from '../utils/image';
import { tiersFromHpp, detectTierAnomalies } from '../utils/pricing';

interface Barang {
  id: string;
  nama_barang: string;
  kategori: string | null;
  hpp: string;
  harga_jual: string;
  stok_saat_ini: number;
  stok_minimum: number;
  unit: string;
  gambar: string | null;
  sku: string | null;
  ukuran: string | null;
  type_kemasan: string | null;
  isi_karton: number | null;
  isi_pcs: number | null;
  harga_het: string | null;
  harga_s1: string | null;
  harga_s2: string | null;
  harga_s3: string | null;
  harga_s4: string | null;
  batas_het: string | null;
}
const empty = {
  nama_barang: '', kategori: '', hpp: 0, harga_jual: 0, stok_saat_ini: 0, stok_minimum: 5, unit: 'pcs', gambar: null as string | null,
  sku: '', ukuran: '', type_kemasan: '', isi_karton: null as number | null, isi_pcs: null as number | null,
  harga_het: null as number | null, harga_s1: null as number | null, harga_s2: null as number | null, harga_s3: null as number | null, harga_s4: null as number | null,
  batas_het: null as number | null,
};

export default function Inventory() {
  const { user } = useAuth();
  const { notify } = useToast();
  const isAdmin = user?.role === 'admin';
  const canMasuk = user?.role === 'gudang' || user?.role === 'admin';
  const [list, setList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [masuk, setMasuk] = useState<{ barang: Barang; jumlah: number; keterangan: string } | null>(null);
  const [opname, setOpname] = useState<{ barang: Barang; stok_baru: number; keterangan: string } | null>(null);
  const [history, setHistory] = useState<{ barang: Barang; rows: any[] } | null>(null);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [lowOnly, setLowOnly] = useState(false);

  const kategoriList = Array.from(new Set(list.map((b) => b.kategori).filter(Boolean))) as string[];
  const filtered = list.filter((b) => {
    const q = search.trim().toLowerCase();
    if (q && !(`${b.nama_barang} ${b.sku || ''}`.toLowerCase().includes(q))) return false;
    if (kategori && b.kategori !== kategori) return false;
    if (lowOnly && !(b.stok_saat_ini < b.stok_minimum)) return false;
    return true;
  });
  const lowCount = list.filter((b) => b.stok_saat_ini < b.stok_minimum).length;

  async function load() {
    setLoading(true);
    try {
      setList((await api.get('/inventory', { params: { limit: 100 } })).data.data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const [importing, setImporting] = useState(false);

  function saveBlob(data: BlobPart, filename: string) {
    const url = URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
  async function downloadTemplate() {
    try { const r = await api.get('/inventory/template-csv', { responseType: 'blob' }); saveBlob(r.data, 'template-produk.csv'); }
    catch (err) { notify('error', apiError(err)); }
  }
  async function exportCsv() {
    try { const r = await api.get('/inventory/export-csv', { responseType: 'blob' }); saveBlob(r.data, 'produk-cdm.csv'); }
    catch (err) { notify('error', apiError(err)); }
  }
  async function importCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // reset agar bisa pilih file sama lagi
    if (!file) return;
    setImporting(true);
    try {
      const csv = await file.text();
      const r = await api.post('/inventory/import-csv', { csv });
      const { imported, skipped, warnings, failed } = r.data.data;
      notify('success', `Import selesai: ${imported} produk${skipped ? `, ${skipped} dilewati` : ''}`);
      if (failed && failed.length) {
        notify('error', `❌ ${failed.length} baris gagal: ${failed.slice(0, 3).map((f: any) => `${f.nama} (${f.error})`).join(', ')}${failed.length > 3 ? ', …' : ''}`);
        console.warn('Baris gagal import:', failed);
      }
      if (warnings && warnings.length) {
        notify('error', `⚠️ ${warnings.length} produk perlu dicek: ${warnings.slice(0, 3).map((w: any) => w.nama).join(', ')}${warnings.length > 3 ? ', …' : ''}`);
        console.warn('Anomali harga import:', warnings);
      }
      load();
    } catch (err) { notify('error', apiError(err)); }
    finally { setImporting(false); }
  }

  const [marginHet, setMarginHet] = useState(15);
  const [marginFloor, setMarginFloor] = useState(10);
  function autoTiers() {
    const hpp = Number(form.hpp);
    if (!hpp || hpp <= 0) { notify('error', 'Isi HPP dulu (lebih dari 0)'); return; }
    if (marginFloor > marginHet) { notify('error', 'Margin terendah tidak boleh lebih besar dari margin HET'); return; }
    const batas = form.batas_het ? Number(form.batas_het) : null;
    const t = tiersFromHpp(hpp, marginHet, marginFloor, 100, batas);
    setForm((f: any) => ({ ...f, ...t }));
    notify('success', `5 tier dihitung dari HPP ${rupiah(hpp)} (margin ${marginHet}%→${marginFloor}%${batas ? `, dibatasi HET ${rupiah(batas)}` : ''})`);
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setForm((f: any) => ({ ...f, gambar: dataUrl }));
    } catch (err: any) {
      notify('error', err?.message || 'Gagal memproses gambar');
    }
  }

  async function saveBarang(e: React.FormEvent) {
    e.preventDefault();
    // Anti-anomali: peringatkan jika harga janggal, tapi tetap boleh lanjut
    const anomalies = detectTierAnomalies({
      hpp: Number(form.hpp), batas_het: form.batas_het, harga_het: form.harga_het, harga_s1: form.harga_s1,
      harga_s2: form.harga_s2, harga_s3: form.harga_s3, harga_s4: form.harga_s4,
    });
    if (anomalies.length && !confirm('⚠️ Ada kemungkinan harga janggal:\n\n• ' + anomalies.join('\n• ') + '\n\nTetap simpan?')) return;
    try {
      // harga_jual mengikuti tier terendah (HET) bila diisi, agar konsisten.
      const hargaJual = form.harga_het != null ? Number(form.harga_het) : Number(form.harga_jual);
      const payload = {
        ...form,
        hpp: Number(form.hpp),
        harga_jual: hargaJual,
        stok_saat_ini: Number(form.stok_saat_ini),
        stok_minimum: Number(form.stok_minimum),
        sku: form.sku?.trim() || null,
        ukuran: form.ukuran?.trim() || null,
        type_kemasan: form.type_kemasan?.trim() || null,
      };
      if (editId) await api.put(`/inventory/${editId}`, payload);
      else await api.post('/inventory', payload);
      notify('success', 'Barang disimpan');
      setShowForm(false);
      load();
    } catch (err) { notify('error', apiError(err)); }
  }

  async function submitOpname(e: React.FormEvent) {
    e.preventDefault();
    if (!opname) return;
    try {
      await api.post(`/inventory/${opname.barang.id}/opname`, { stok_baru: Number(opname.stok_baru), keterangan: opname.keterangan });
      notify('success', `Stok ${opname.barang.nama_barang} disesuaikan jadi ${opname.stok_baru}`);
      setOpname(null); load();
    } catch (err) { notify('error', apiError(err)); }
  }

  async function submitMasuk(e: React.FormEvent) {
    e.preventDefault();
    if (!masuk) return;
    try {
      await api.post(`/inventory/${masuk.barang.id}/masuk`, { jumlah: Number(masuk.jumlah), keterangan: masuk.keterangan });
      notify('success', `Stok ${masuk.barang.nama_barang} bertambah ${masuk.jumlah}`);
      setMasuk(null);
      load();
    } catch (err) { notify('error', apiError(err)); }
  }

  async function openHistory(b: Barang) {
    const rows = (await api.get(`/inventory/${b.id}/history`)).data.data;
    setHistory({ barang: b, rows });
  }

  async function removeBarang(b: Barang) {
    if (!confirm(`Hapus barang "${b.nama_barang}"?`)) return;
    try {
      await api.delete(`/inventory/${b.id}`);
      notify('success', 'Barang dihapus');
      load();
    } catch (err) { notify('error', apiError(err)); }
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Inventory</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn secondary" onClick={downloadTemplate}>📄 Template</button>
          <button className="btn secondary" onClick={exportCsv}><Upload size={15} aria-hidden /> Export CSV</button>
          {isAdmin && (
            <label className="btn secondary" style={{ cursor: 'pointer', margin: 0 }}>
              {importing ? 'Mengimpor…' : <><Download size={15} aria-hidden /> Import CSV</>}
              <input type="file" accept=".csv,text/csv" onChange={importCsv} disabled={importing} style={{ display: 'none' }} />
            </label>
          )}
          {isAdmin && <button className="btn" onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}><Plus size={16} aria-hidden /> Barang</button>}
        </div>
      </div>

      <div className="toolbar" style={{ alignItems: 'flex-start' }}>
        <div className="chips-row">
          <button className={'chip' + (kategori === '' && !lowOnly ? ' is-active' : '')} onClick={() => { setKategori(''); setLowOnly(false); }}>Semua</button>
          {kategoriList.map((k) => (
            <button key={k} className={'chip' + (kategori === k ? ' is-active' : '')} onClick={() => setKategori(kategori === k ? '' : k)}>{k}</button>
          ))}
          {lowCount > 0 && <button className={'chip is-warn' + (lowOnly ? ' is-active' : '')} onClick={() => setLowOnly((v) => !v)}>⚠️ Stok Rendah ({lowCount})</button>}
        </div>
        <input placeholder="Cari nama / SKU…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '8px 11px', borderRadius: 8, border: '1px solid var(--border)', minWidth: 200 }} />
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? <Spinner /> : list.length === 0 ? <EmptyState message="Belum ada barang." /> : filtered.length === 0 ? <EmptyState message="Tidak ada barang cocok filter." /> : (
          <table>
            <thead><tr><th>Foto</th><th>SKU</th><th>Barang</th><th>Kategori</th><th>Harga grosir (HET→S4)</th><th>Stok</th><th>Min</th><th></th></tr></thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} style={b.stok_saat_ini < b.stok_minimum ? { background: '#fef2f2' } : {}}>
                  <td>{b.gambar ? <img src={b.gambar} alt={b.nama_barang} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} /> : <span className="muted">—</span>}</td>
                  <td className="muted sku-code">{b.sku || '-'}</td>
                  <td>{b.nama_barang}{b.ukuran ? <span className="muted"> · {b.ukuran}</span> : ''}</td>
                  <td>{b.kategori || '-'}</td>
                  <td style={{ fontSize: 13 }}>
                    {b.harga_het ? <>{rupiah(b.harga_het)} <span className="muted">→ {rupiah(b.harga_s4 || b.harga_het)}</span></> : rupiah(b.harga_jual)}
                    {b.batas_het && <span title={`Batas HET ${rupiah(b.batas_het)}`} style={{ marginLeft: 6, fontSize: 11, color: '#b45309' }}>🔒 HET</span>}
                  </td>
                  <td><b>{b.stok_saat_ini}</b> {b.unit}{b.stok_saat_ini < b.stok_minimum && <span className="muted"> ⚠️</span>}</td>
                  <td>{b.stok_minimum}</td>
                  <td className="right">
                    <button className="btn secondary small" onClick={() => openHistory(b)}>History</button>
                    {canMasuk && <button className="btn small" style={{ marginLeft: 6 }} onClick={() => setMasuk({ barang: b, jumlah: 0, keterangan: '' })}>+ Masuk</button>}
                    {canMasuk && <button className="btn secondary small" style={{ marginLeft: 6 }} onClick={() => setOpname({ barang: b, stok_baru: b.stok_saat_ini, keterangan: '' })}>Opname</button>}
                    {isAdmin && <button className="btn secondary small" style={{ marginLeft: 6 }} onClick={() => { setForm({ ...b, hpp: Number(b.hpp), harga_jual: Number(b.harga_jual) }); setEditId(b.id); setShowForm(true); }}>Edit</button>}
                    {isAdmin && <button className="btn danger small" style={{ marginLeft: 6 }} onClick={() => removeBarang(b)}>Hapus</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Modal title={editId ? 'Edit Barang' : 'Tambah Barang'} onClose={() => setShowForm(false)}>
          <form onSubmit={saveBarang}>
            <div className="field"><label>Nama Barang</label><input value={form.nama_barang} onChange={(e) => setForm({ ...form, nama_barang: e.target.value })} required /></div>
            <div className="row">
              <div className="field"><label>Kategori</label><input value={form.kategori || ''} onChange={(e) => setForm({ ...form, kategori: e.target.value })} /></div>
              <div className="field"><label>Unit</label><input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
            </div>
            <div className="row">
              <div className="field"><label>SKU</label><input value={form.sku || ''} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="MKG-0001" /></div>
              <div className="field"><label>Ukuran</label><input value={form.ukuran || ''} onChange={(e) => setForm({ ...form, ukuran: e.target.value })} placeholder="Karton/Dus" /></div>
              <div className="field"><label>Type kemasan</label><input value={form.type_kemasan || ''} onChange={(e) => setForm({ ...form, type_kemasan: e.target.value })} placeholder="Botol/Pouch" /></div>
            </div>
            <div className="row">
              <div className="field"><label>Isi / Karton</label><input type="number" value={form.isi_karton ?? ''} onChange={(e) => setForm({ ...form, isi_karton: e.target.value === '' ? null : Number(e.target.value) })} /></div>
              <div className="field"><label>Isi Pcs</label><input type="number" value={form.isi_pcs ?? ''} onChange={(e) => setForm({ ...form, isi_pcs: e.target.value === '' ? null : Number(e.target.value) })} /></div>
              <div className="field"><label>HPP</label><input type="number" value={form.hpp} onChange={(e) => setForm({ ...form, hpp: e.target.value })} required /></div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>⚡ Hitung otomatis dari HPP</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="field" style={{ marginBottom: 0, maxWidth: 130 }}>
                  <label style={{ fontWeight: 400 }}>Margin HET %</label>
                  <input type="number" value={marginHet} onChange={(e) => setMarginHet(Number(e.target.value))} />
                </div>
                <div className="field" style={{ marginBottom: 0, maxWidth: 150 }}>
                  <label style={{ fontWeight: 400 }}>Margin terendah %</label>
                  <input type="number" value={marginFloor} onChange={(e) => setMarginFloor(Number(e.target.value))} />
                </div>
                <button type="button" className="btn small" onClick={autoTiers}>Hitung 5 tier</button>
              </div>
              <div className="field" style={{ marginBottom: 0, marginTop: 8, maxWidth: 220 }}>
                <label style={{ fontWeight: 400 }}>Batas HET pemerintah (opsional)</label>
                <input type="number" value={form.batas_het ?? ''} onChange={(e) => setForm({ ...form, batas_het: e.target.value === '' ? null : Number(e.target.value) })} placeholder="mis. 15700 utk MinyaKita" />
              </div>
              <small className="muted">Margin grosir pasar 10–25%. Untuk komoditas diatur (MinyaKita), isi batas HET — harga tidak akan melampauinya.</small>
            </div>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Harga grosir berjenjang (per qty)</label>
            <div className="row" style={{ gap: 6 }}>
              <div className="field"><label style={{ fontWeight: 400 }}>HET 1-4</label><input type="number" value={form.harga_het ?? ''} onChange={(e) => setForm({ ...form, harga_het: e.target.value === '' ? null : Number(e.target.value) })} /></div>
              <div className="field"><label style={{ fontWeight: 400 }}>S1 5-9</label><input type="number" value={form.harga_s1 ?? ''} onChange={(e) => setForm({ ...form, harga_s1: e.target.value === '' ? null : Number(e.target.value) })} /></div>
              <div className="field"><label style={{ fontWeight: 400 }}>S2 10-24</label><input type="number" value={form.harga_s2 ?? ''} onChange={(e) => setForm({ ...form, harga_s2: e.target.value === '' ? null : Number(e.target.value) })} /></div>
              <div className="field"><label style={{ fontWeight: 400 }}>S3 25-49</label><input type="number" value={form.harga_s3 ?? ''} onChange={(e) => setForm({ ...form, harga_s3: e.target.value === '' ? null : Number(e.target.value) })} /></div>
              <div className="field"><label style={{ fontWeight: 400 }}>S4 ≥50</label><input type="number" value={form.harga_s4 ?? ''} onChange={(e) => setForm({ ...form, harga_s4: e.target.value === '' ? null : Number(e.target.value) })} /></div>
            </div>
            <input type="hidden" value={form.harga_jual} />
            <div className="row">
              <div className="field"><label>Stok Awal</label><input type="number" value={form.stok_saat_ini} onChange={(e) => setForm({ ...form, stok_saat_ini: e.target.value })} disabled={!!editId} /></div>
              <div className="field"><label>Stok Minimum</label><input type="number" value={form.stok_minimum} onChange={(e) => setForm({ ...form, stok_minimum: e.target.value })} /></div>
            </div>
            <div className="field">
              <label>Gambar Barang (opsional)</label>
              <input type="file" accept="image/*" onChange={onPickImage} />
              {form.gambar && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={form.gambar} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                  <button type="button" className="btn secondary small" onClick={() => setForm({ ...form, gambar: null })}>Hapus gambar</button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {masuk && (
        <Modal title={`Stok Masuk — ${masuk.barang.nama_barang}`} onClose={() => setMasuk(null)}>
          <form onSubmit={submitMasuk}>
            <div className="field"><label>Jumlah Masuk</label><input type="number" min={1} value={masuk.jumlah} onChange={(e) => setMasuk({ ...masuk, jumlah: Number(e.target.value) })} required /></div>
            <div className="field"><label>Keterangan</label><input value={masuk.keterangan} onChange={(e) => setMasuk({ ...masuk, keterangan: e.target.value })} placeholder="Restock supplier…" /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn secondary" onClick={() => setMasuk(null)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {opname && (
        <Modal title={`Stok Opname — ${opname.barang.nama_barang}`} onClose={() => setOpname(null)}>
          <form onSubmit={submitOpname}>
            <p className="muted">Stok sistem saat ini: <b>{opname.barang.stok_saat_ini}</b> {opname.barang.unit}</p>
            <div className="field"><label>Stok Fisik / Baru</label><input type="number" min={0} value={opname.stok_baru} onChange={(e) => setOpname({ ...opname, stok_baru: Number(e.target.value) })} required /></div>
            <div className="field"><label>Alasan / Keterangan</label><input value={opname.keterangan} onChange={(e) => setOpname({ ...opname, keterangan: e.target.value })} placeholder="mis. selisih hitung fisik, rusak, hilang" required /></div>
            <p className="muted" style={{ fontSize: 13 }}>Selisih: <b>{Number(opname.stok_baru) - opname.barang.stok_saat_ini >= 0 ? '+' : ''}{Number(opname.stok_baru) - opname.barang.stok_saat_ini}</b> (dicatat di riwayat sebagai penyesuaian)</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn secondary" onClick={() => setOpname(null)}>Batal</button>
              <button className="btn">Simpan Opname</button>
            </div>
          </form>
        </Modal>
      )}

      {history && (
        <Modal title={`Riwayat Stok — ${history.barang.nama_barang}`} onClose={() => setHistory(null)}>
          {history.rows.length === 0 ? <EmptyState message="Belum ada riwayat." /> : (
            <table>
              <thead><tr><th>Tanggal</th><th>Tipe</th><th>Jumlah</th><th>Keterangan</th></tr></thead>
              <tbody>
                {history.rows.map((h) => (
                  <tr key={h.id}>
                    <td>{new Date(h.created_at).toLocaleString('id-ID')}</td>
                    <td>{h.tipe === 'masuk' ? '⬆️ masuk' : h.tipe === 'keluar' ? '⬇️ keluar' : '⚖️ opname'}</td>
                    <td>{h.jumlah}</td>
                    <td>{h.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal>
      )}
    </div>
  );
}
