---
name: brontolano-design
description: Use this skill to generate well-branded interfaces and assets for Brontolano (PT Rojo Brontolano) — the CDM operations app and public digital catalog — for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `README.md` — the full design guide: brand context, content & visual foundations, iconography, file index.
- `styles.css` — link this one file to inherit every token + webfont. It `@import`s `tokens/*.css`.
- `tokens/` — colors (Brontolano red, slate, commerce green, status badges), typography (Plus Jakarta Sans + JetBrains Mono), spacing, elevation, base.
- `components/` — React primitives (Button, Input, Select, StatusBadge, TierBadge, Price, StatCard, Card, Modal, Toast, QtyStepper, ProductCard, CartBar). Each has a `.prompt.md` with usage.
- `ui_kits/` — full-screen recreations: `cdm-admin` (desktop back-office), `katalog` (public storefront), `staff-pwa` (mobile field tools).
- `assets/brontolano-mark.png` — the red crown logo.
- `guidelines/` — live specimen cards for every foundation.

## Non-negotiables
- **Red `#ED1C24` is the brand.** Slate is structure, commerce green `#16A34A` is money/go, WhatsApp green is the order channel. Danger red is a deeper, separate red.
- **Bahasa Indonesia, value-first voice** ("Makin Banyak, Makin Murah"). Say *konsumen*, not pelanggan. Money is `Rp 1.250.000` (id-ID, tabular).
- **Tiered wholesale pricing** (HET·S1–S4) is the signature mechanic — surface it.
- Flat surfaces, 1px hairline borders, radii that grow with surface size, shadow only for floating things.

## To build a static mock from the React components
Link `styles.css`, load React + Babel (pinned) + `_ds_bundle.js`, then read components from `window.<Namespace>` (run the design-system check to confirm the exact namespace) in a `text/babel` block. See any `components/*/*.card.html` or `ui_kits/*/index.html` for the exact pattern.
