**Button** — the brand action element; use Brontolano red for the single most-important action per view, and reserve commerce/WhatsApp green for catalog ordering.

```jsx
<Button variant="primary" onClick={save}>Simpan</Button>
<Button variant="commerce" block iconLeft={<i data-lucide="shopping-cart" />}>+ Keranjang</Button>
<Button variant="whatsapp" size="lg" block>Pesan via WhatsApp</Button>
<Button variant="secondary">Batal</Button>
<Button variant="danger" size="sm">Hapus</Button>
```

Variants: `primary` (red), `secondary` (slate), `ghost` (outline), `danger` (destructive only), `commerce` (green go), `whatsapp`. Sizes `sm | md | lg`. Props: `block`, `iconLeft`, `iconRight`, plus all native `<button>` attrs (`disabled`, `type`, `onClick`).
