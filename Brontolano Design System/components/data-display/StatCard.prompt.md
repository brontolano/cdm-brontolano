**StatCard** — the dashboard summary tile. Pre-format the value (use `rupiah()` for money); add `accent` to give the hero metric a red top rule.

```jsx
<StatCard label="Konsumen Aktif" value="128" icon="🏪" />
<StatCard label="Omset Bulan Ini" value={rupiah(24800000)} accent delta="12%" deltaDir="up" />
<StatCard label="Stok Rendah" value="6" icon="📦" delta="2 baru" deltaDir="down" />
```

Lay them out in a `repeat(auto-fit, minmax(180px, 1fr))` grid like the live dashboard.
