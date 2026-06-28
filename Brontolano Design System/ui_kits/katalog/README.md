# UI Kit — Katalog Publik (storefront)

The flagship **public** surface: a mobile-first PWA catalog anyone can browse and order from over WhatsApp — no login, no checkout form. Black bar, commerce green, tiered wholesale pricing that drops live as the cart grows.

**Files**
- `index.html` — phone-framed, fully interactive (search, category chips, add to cart, cart sheet, checkout, confirmation).
- `Catalog.jsx` — the whole storefront + tier pricing logic (`priceForQty`).

**Composes** `ProductCard, CartBar, QtyStepper, Button, Input` from the bundle.

**The flow:** browse grid → tap **+ Keranjang** (price re-tiers, 🔥 tag appears) → **Lihat Keranjang** → adjust in the cart sheet → **Lanjut Pesan via WhatsApp** → pemesan form → **Kirim** → confirmation. Emoji are used decoratively as in the live app (💡 banner, 🔍 search, ⬇️ install).

**Source of truth:** `frontend/src/pages/Katalog.tsx` in `cdm-brontolano`.
