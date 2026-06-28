# UI Kit — CDM Admin (back-office)

Desktop operations console for **admin & management**. Fixed slate-900 sidebar + sticky white topbar; white cards on a slate-100 field. This is the dense, calm half of Brontolano.

**Files**
- `index.html` — interactive shell; click the sidebar to switch views.
- `AdminShell.jsx` — sidebar + topbar + the `Icon` helper (robust Lucide-in-React).
- `DashboardView.jsx` — stat tiles, omset bar chart, recent orders, top barang, piutang aging.
- `KonsumenView.jsx` — searchable shop list with status + actions.
- `InventoryView.jsx` — stock table with tiered pricing (HET→S4), HET caps, low-stock tint.
- `OrdersView.jsx` — order list with status filter chips.

**Composes** `StatCard, Card, StatusBadge, TierBadge, Button, Input` from the bundle, plus Lucide icons (CDN).

**Source of truth:** `frontend/src/pages/{Dashboard,Konsumen,Inventory,Orders}.tsx` in `cdm-brontolano`. Note the live app used a blue primary; this kit applies the brand red per the design system (see root README).
