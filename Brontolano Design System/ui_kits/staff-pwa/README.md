# UI Kit — Staff PWA (Lapangan / Gudang)

Full-screen **mobile** app for field & warehouse staff, redesigned around researched field-app patterns: a **bottom tab bar** in the thumb zone, a **task-focused home dashboard** with progress/metrics visibility, big high-contrast targets, and actions-in-context. Ink (slate-900) headers for outdoor legibility; brand red for the active tab and primary actions; commerce green for money/positive.

**Files**
- `index.html` — phone-framed, interactive; tap the bottom nav to switch tabs.
- `Staff.jsx` — five tabs in one component (`tab` state) + the POS flow.

**Tabs**
- **Beranda** — greeting + sync status, today's omset **target progress bar**, mini-stats (Order · Toko · Setoran), quick actions, and a "Tugas Hari Ini" task list.
- **Rute** — numbered delivery stops with per-stop status (selesai / proses / menunggu) and Mulai/Selesai actions + "Buka Maps".
- **Order** — POS: pick konsumen → add barang (live tier price) → Buat Order → receipt step.
- **Stok** — warehouse: Stok Masuk / Keluar quick actions + a "Perlu Restok" low-stock list.
- **Akun** — profile, sync/offline status, settings menu, logout.

**Composes** `Select, Button, QtyStepper, StatusBadge` from the bundle + Lucide icons (CDN).

**Source of truth:** `frontend/src/pages/lapangan/*` and `frontend/src/pages/gudang/*` in `cdm-brontolano`. The original MVP was a flat card hub on a blue header; this redesign elevates it to a tabbed, on-brand field app per the design system.
