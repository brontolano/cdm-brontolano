**ProductCard** — the public catalog tile. Shows the image, name, SKU, tiered per-carton price (+ optional per-pcs), and switches from a green "+ Keranjang" button to a QtyStepper once in the cart. When a quantity discount is live, lead with the **value**: pass `wasPrice` (struck-through HET) and `saving` (the "Hemat Rp X/karton" pill), plus `hotTier` for the red tier flag.

```jsx
<ProductCard
  name="Indomie Goreng Spesial" sku="MKG-0012" size="Karton" category="Mie Instan"
  price={112000} wasPrice={qty >= 6 ? 116000 : null} saving={qty >= 6 ? 4000 : 0}
  perPcs={2800} isi={40} hotTier={qty >= 10 ? 'S2' : null}
  qty={qty} onQty={setQty}
/>
```

Lay out in a `repeat(auto-fill, minmax(150px, 1fr))` grid. Composes `QtyStepper`.
