**Price** — Rupiah price block with optional `/unit` and a green per-pcs line. The file also exports a `rupiah()` formatter for production code that imports the module directly.

```jsx
<Price amount={58000} unit="karton" perPcs={2420} isi={24} size="lg" />
<Price amount={16000} unit="pcs" size="sm" />
```

Sizes `sm | md | lg`. Always tabular-numeral; pass `unit=""` to show a bare amount (totals, subtotals).

> **Namespace note:** the bundle only exposes Capitalized names on `window.<Namespace>`, so `rupiah` is **not** reachable there. In an `@dsCard`/HTML consumer, either render `<Price unit="" />` or drop in the one-liner:
> `const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');`

