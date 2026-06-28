# Brontolano Design System

The brand & UI system for **Consumer Data Manager (CDM)** — the operations app and public digital catalog built by **PT Rojo Brontolano**, an Indonesian wholesale staple-goods (*grosir sembako*) distributor.

> *Rojo* means **king** in Javanese — hence the **crown** in the mark, and the confident **red** that runs through the brand. Brontolano sells in cartons to warungs, toko, and grosir; the product helps the field, warehouse, admin, and management teams run that business, and gives shopkeepers a public catalog they can order from over WhatsApp.

---

## What this system covers

CDM is one React + Vite codebase deployed as **three distinct surfaces**, each with its own personality inside one brand:

| Surface | Who | Feel | Signature |
|---|---|---|---|
| **Katalog Publik** | Anyone (no login) | Mobile-first storefront, friendly & fast | Black bar, **commerce green**, WhatsApp ordering, tier pricing |
| **CDM Admin** | Admin · Management (desktop) | Dense, calm back-office | Dark slate sidebar, data tables, status badges, charts |
| **Staff PWA** | Lapangan · Gudang (mobile) | Big-tap field tools | Full-screen cards, GPS, POS, thermal receipts |

The connective tissue: **Brontolano Red** for identity & primary action, a **slate** neutral system, **commerce green** for money/savings/go, and a relentlessly **Indonesian, WhatsApp-native, value-first** voice.

---

## Sources (provenance)

Everything here was reverse-engineered from materials the team provided. You may not have access, but they are recorded so you can dig deeper:

- **Codebase** — `ConsumerDataManager/` (mounted locally). React + TypeScript + Vite frontend, Express + PostgreSQL backend, Docker. The frontend (`frontend/src`) is the source of truth for every screen, color, and component recreated here.
- **GitHub** — `brontolano/cdm-brontolano` (private) — *CDM Brontolano: POS, katalog & manajemen produk/konsumen*. Identical to the local mount. Explore for the live implementation: <https://github.com/brontolano/cdm-brontolano>
- **GitHub** — `hamdansumedang/Katalog-Digital-Den-Ana` — *System Aplikasi Katalog dan Pesanan Retail RBL*, a sibling catalog/order app worth referencing for catalog patterns: <https://github.com/hamdansumedang/Katalog-Digital-Den-Ana>
- **GitHub** — `brontolano/brontolano` — official Brontolano site source (README only at time of writing): <https://github.com/brontolano/brontolano>
- **Brand mark** — `uploads/logo_icon_merah.png` → `assets/brontolano-mark.png` (the red crown). The live catalog also references `https://brontolano.com/logo.png`.
- **Spec docs** — `00-Project-Brief.md`, `03-UI-Breakdown.md` inside the codebase: roles, data models, page inventory, and the original (aspirational) design tokens.

> To build better Brontolano designs, read `cdm-brontolano` directly — the screens in `frontend/src/pages` carry the real interaction logic (tier pricing, WhatsApp order assembly, role gating) that these UI kits only mimic cosmetically.

---

## Reading order

1. **Visual Foundations** (below) — colors, type, spacing, surfaces, motion.
2. **Content Fundamentals** (below) — voice, Bahasa Indonesia conventions, domain vocabulary.
3. **Iconography** (below) — the emoji reality and the Lucide upgrade path.
4. **`tokens/`** — the CSS custom properties behind all of it.
5. **`components/`** + **`ui_kits/`** — primitives and full-screen recreations.
6. The **Design System tab** — every specimen and component card, rendered live.

---

## Content Fundamentals

**Language.** Bahasa Indonesia, always. English appears only as borrowed product nouns the trade actually uses (*order, invoice, stok, POS, broadcast, dashboard*). Never translate those into stiff formal Indonesian — shopkeepers say "order", not "pemesanan".

**Address & tone.** Warm, plain, and respectful. Address the reader as **Anda** in the public catalog and customer-facing copy; staff tools are terse and imperative (*Pilih konsumen dulu*, *Tambah minimal 1 barang*). The brand is a helpful *juragan* — confident, never corporate, never cutesy.

**Voice = "Marketing 7.0" (human-centric, value-first).** Kotler's Marketing 7.0 blends technology with the human touch: speak to a real person, lead with their gain, and earn trust through transparency. Five working principles — apply them to every headline, button, and toast:

1. **Human-centric — talk to the *juragan*, not "users."** Address **Anda** directly and mirror how a shopkeeper actually thinks: margin, modal, cash flow, time saved. *"Belanja grosir untuk toko Anda — langsung dari distributor."*
2. **Value-first — lead with the gain, and show the number.** Every screen answers *"apa untungnya buat saya?"*. Quantify it: *"Hemat Rp 6.000/karton di tier S2"*, *"Makin Banyak, Makin Murah."*
3. **Trust & transparency — no hidden anything.** Real stock, honest tiers, government **HET** respected, no surprise fees. *"Harga grosir transparan · ongkir dikonfirmasi admin."*
4. **Human channel — WhatsApp, not forms.** Tech removes the friction; a person closes the deal. *"Pesan via WhatsApp"* — no account, no checkout, no card.
5. **Relationship over transaction — *langganan*, not one-off.** Warm, personal closes that invite the next order. *"Terima kasih, Pak Budi! Pesanan toko Anda sedang kami siapkan."*

**Casing.** Sentence case for everything readable (headings, buttons, labels). UPPERCASE only for tiny table headers and the receipt brand line (`BRONTOLANO`). Tier codes are uppercase tokens: **HET, S1, S2, S3, S4**.

**Money.** Always `Rp` + Indonesian thousands separators (dots): **`Rp 1.250.000`** — produced by `toLocaleString('id-ID')`. Per-unit prices read `Rp 58.000 /karton`, `≈ Rp 2.420 /pcs`. Use tabular figures so columns align.

**Domain vocabulary (use the trade's words):**
- **konsumen** — the shop/customer (a *toko*, *warung*, or *grosir*); never "pelanggan" in this app.
- **karton / pcs / isi** — packaging units; pricing is per *karton*.
- **HET** — *Harga Eceran Tertinggi*, the government price ceiling (e.g. MinyaKita); also the name of the smallest-quantity tier.
- **tier S1–S4** — wholesale price strata by quantity (6–9, 10–24, 25–150, >150 karton).
- **omset / laba / piutang** — revenue / gross profit / receivables (back-office reporting).
- **stok masuk / keluar / opname** — stock in / out / physical count reconciliation.
- **pengiriman / rute** — delivery / optimized route.
- **lapangan / gudang** — field staff / warehouse staff (the two mobile roles).

**Microcopy patterns.**
- Empty states are plain and a little warm: *"Belum ada konsumen."*, *"Tidak ada piutang. 🎉"*
- Confirmations name the result: *"Order ORD-00123 dibuat"*, *"Stok Indomie bertambah 24"*.
- Warnings are honest, not alarmist: *"⚠️ Ada kemungkinan harga janggal… Tetap simpan?"*
- Receipts close human: *"Terima kasih atas pesanan Anda — ~ Brontolano ~"*.

**Don't:** corporate filler, exclamation spam (one per moment, max), translated English nouns, or pelanggan/customer where the app means *konsumen*.

---

## Visual Foundations

### Color — red identity, slate structure, green commerce

The system runs on **three working colors plus a neutral spine**, each with a clear job. Don't reach past these without reason.

- **Brontolano Red `#ED1C24`** — the brand. The crown, the logo lockup, the **primary action** in branded/admin contexts. Hover deepens to `#D11018`, active `#AF0F16`. Used as a confident accent, not a flood — red is for the *one* most important action and brand moments, not whole backgrounds.
- **Slate neutrals** (`#F1F5F9` page, `#FFFFFF` card, `#E2E8F0` border, `#0F172A` ink/text, `#64748B` muted) — the entire structural system. The admin **sidebar is slate-900**; the public catalog **header is pure black**. This ramp is lifted verbatim from the app (Tailwind slate).
- **Commerce Green `#16A34A`** — money, savings, *go*. It owns the catalog's add-to-cart and checkout, the "makin murah" savings tags, and doubles as the **success** semantic. Soft bg `#F0FDF4`, border `#BBF7D0`.
- **WhatsApp Green `#25D366`** — reserved, functional. Only the "Pesan via WhatsApp" / broadcast actions, because that *is* the order channel.

Semantic hues for state: **info** blue `#2563EB`, **warning** amber `#D97706`, **danger** red `#DC2626` (a deeper red than the brand, used *only* for destructive/error — keep it distinct from brand red). A full set of **status-badge pairs** (draft, confirmed, proses, dikirim, selesai, dibatalkan, lunas, belum, sebagian, aktif, tidak_aktif) is tokenized — these are domain colors, not decoration.

> **Honest note on the live app:** the current MVP used Tailwind-default **blue** (`#2563eb`) as its admin primary — an unbranded placeholder. The spec doc explicitly calls for `#ED1C24`. This system resolves that by making **red the primary** everywhere branded, keeping **blue only as the `info`/`confirmed` status hue**, and preserving the catalog's intentional **green**. If you are matching the *current* production blue exactly, override `--primary` to `--info-500` — but the brand direction is red.

### Type — Plus Jakarta Sans + JetBrains Mono

- **Plus Jakarta Sans** carries everything: display, UI, body. It was commissioned as the typeface of Jakarta — a deliberate, regionally-resonant choice for an Indonesian distributor, and a modern humanist-geometric face that reads cleanly at the small sizes a dense back-office needs. Weights 400–800; headings 700–800 with tight tracking (`-0.015em`), display tighter (`-0.03em`).
- **JetBrains Mono** for **data**: SKUs, tier codes, prices in tables, and thermal receipts — anywhere figures must line up. Tabular numerals on.
- **Scale** is px-based around a **14px body baseline** (the app's table density). Steps: 11 · 12 · 13 · 14 · 15 · 16 · 18 · 20 · 24 · 30 · 38 · 48. Body line-height 1.5; headings 1.15–1.3.

> **Substitution flag:** the live app ships **no** webfont (system-ui stack); the spec doc named **Inter/Roboto**. Plus Jakarta Sans is a brand upgrade proposed here and loaded from Google Fonts. If the team prefers system-ui or Inter, swap `--font-sans` in `tokens/typography.css` — every surface follows.

### Spacing, radii & borders

- **8px base unit.** Scale 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64. Card padding 16; section gaps 16–24; mobile gutters 12–16.
- **Radii climb with surface size:** 6 images · 8 buttons/inputs · 10–12 cards · 14 catalog product cards & banners · 16 login/mobile cards · **999 pills** (badges, chips, tier pills, the floating cart bar). Rounder = friendlier/more public (catalog); tighter = denser/more utility (tables).
- **Borders do the structural work.** Almost every container is a **1px `#E2E8F0` hairline**, not a shadow. Table rows divide with the same hairline. Low-stock and overdue rows tint their background `#FEF2F2` (a faint danger wash) rather than adding chrome.

### Surfaces, depth & background

- **Flat by default.** Page is slate-100, cards are white with a hairline. Depth is spent only on things that genuinely float.
- **Elevation ladder:** `xs` (cards) → `md` (toasts, `0 4px 12px`) → `lg` (login card, `0 10px 40px`) → `xl` (modals over a `rgba(0,0,0,.45)` scrim). Bottom sheets in the catalog slide up over the same scrim with an 18px top radius and a grab handle.
- **Colored CTA glow** is a signature: the floating actions carry a tinted shadow in their own hue — `--shadow-commerce` (`0 8px 24px rgba(22,163,74,.4)`) under the green cart bar, `--shadow-brand` under red primaries.
- **Backgrounds are solid, not gradients** — with two deliberate exceptions: the **login** screen (`linear-gradient(135deg,#1e3a8a,#2563eb)`, the one place blue still lives as atmosphere) and the catalog's **savings banner** (`linear-gradient(135deg,#15803d,#16a34a)`). No textures, no patterns, no photographic hero — product imagery is square, contained, on `#F8FAFC`.

### Motion & interaction

- **Quick and unshowy.** Transitions are short (120–200ms) and mostly opacity/background swaps. No bounce on UI chrome; reserve spring easing for a sheet or a celebratory toast.
- **Hover** = a one-step-darker fill (primary → `#D11018`; sidebar item → slate-800) or a subtle surface tint on rows. **Press/active** = the next-darker step. Disabled = `opacity .5` + `not-allowed`. Focus = a 2px brand-red ring at `offset 2px`.
- **Steppers, chips, and the cart bar** give immediate, obvious feedback — this is a tool used one-handed in a warehouse or on a motorbike; tap targets are ≥44px and never subtle.

### Layout rules

- **Admin:** fixed 230px slate sidebar + sticky white topbar; content maxes around 1200px on a slate-100 field. Collapses to a 60px icon rail under 768px.
- **Catalog & Staff PWA:** single mobile column (≤560px), sticky header + sticky search, a floating bottom action bar / cart, and `env(safe-area-inset-*)` padding so it survives as an installed PWA.

---

## Iconography

**The reality: this app speaks in emoji.** Navigation, actions, and status are carried by system emoji, not an icon font — 📊 Dashboard, 🏪 Konsumen, 📦 Inventory, 🧾 Orders, 💵 Invoices, 🚚 Pengiriman, 💬 Broadcast, 👥 Users, 🛒 brand, 📍 GPS, ⬆️/⬇️ stock in/out, ⚖️ opname, 🔥 hot tier, 💡 tip, ⚡ auto-calc, 🔒 HET cap, ✅ success, ⚠️ warning. There are **no SVG icon assets and no icon font** in the codebase; maps come from **Leaflet**, charts from **Recharts**. Emoji is genuinely part of the product's current visual language — warm, instantly legible to non-technical shopkeepers, zero-dependency.

**The upgrade path: [Lucide](https://lucide.dev).** For polished, on-brand work (marketing, decks, refreshed product chrome), this system standardizes on **Lucide** line icons — 1.75–2px stroke, rounded joins, which sit naturally beside Plus Jakarta Sans. Load from CDN:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="store"></i>  <!-- then lucide.createIcons() -->
```

Suggested swaps: 🏪→`store`, 📦→`package`, 🧾→`receipt`, 🚚→`truck`, 💬→`message-circle`, 📊→`bar-chart-3`, 📍→`map-pin`, 🛒→`shopping-cart`, 🔥→`flame`. The components and UI kits here use Lucide for chrome while **keeping a few brand-defining emoji** where they carry meaning (the 🔥 savings tier, the WhatsApp mark). Treat emoji as the *legacy/native* layer and Lucide as the *brand* layer — pick one per surface, don't mix randomly.

**Logo / mark.** `assets/brontolano-mark.png` — the red crown. Give it clear space, never recolor it, and pair it with the wordmark "Brontolano" set in Plus Jakarta Sans ExtraBold. On dark bars (catalog header, sidebar) the mark sits on black/slate-900 with white wordmark.

---
## Index / manifest

**Root**
- `styles.css` — global entry point (link this one file). `@import`s everything below.
- `README.md` — this guide. · `SKILL.md` — portable Agent-Skill wrapper.
- `assets/brontolano-mark.png` — the red crown logo (only brand binary).

**`tokens/`** (all reachable from `styles.css`)
- `colors.css` — brand red ramp, slate ramp, commerce green, WhatsApp, semantic hues, status-badge pairs, semantic aliases.
- `typography.css` — families, weights, size scale, leading, tracking.
- `spacing.css` — 8px spacing scale, radii, borders, layout rails.
- `elevation.css` — shadows (incl. brand/commerce glows), motion, blur, z-index.
- `fonts.css` — Plus Jakarta Sans + JetBrains Mono (Google Fonts). · `base.css` — element defaults.

**`components/`** (React primitives — each has `.jsx` + `.d.ts` + `.prompt.md`, mounted via `window.<Namespace>`)
- `forms/` — `Button`, `IconButton`, `Input`, `Select`
- `data-display/` — `StatusBadge`, `TierBadge`, `Price` (+ `rupiah()`), `StatCard`
- `surfaces/` — `Card`, `Modal`, `Toast`
- `catalog/` — `QtyStepper`, `ProductCard`, `CartBar`

**`ui_kits/`** (full-screen, interactive recreations)
- `cdm-admin/` — desktop back-office (dashboard, konsumen, inventory, orders).
- `katalog/` — public mobile storefront (browse → cart → WhatsApp checkout).
- `staff-pwa/` — mobile field tools (home hub + POS + receipt).

**`guidelines/`** — 18 live specimen cards (Colors · Type · Spacing · Brand) shown in the Design System tab.

> Build order for anything new: link `styles.css` → reach for a `components/*` primitive (read its `.prompt.md`) → assemble like the matching `ui_kits/*/index.html`. When in doubt about a value, the token is the source of truth.

