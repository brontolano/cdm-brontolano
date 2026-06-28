/* @ds-bundle: {"format":3,"namespace":"BrontolanoDesignSystem_7cf21c","components":[{"name":"CartBar","sourcePath":"components/catalog/CartBar.jsx"},{"name":"ProductCard","sourcePath":"components/catalog/ProductCard.jsx"},{"name":"QtyStepper","sourcePath":"components/catalog/QtyStepper.jsx"},{"name":"Price","sourcePath":"components/data-display/Price.jsx"},{"name":"StatCard","sourcePath":"components/data-display/StatCard.jsx"},{"name":"StatusBadge","sourcePath":"components/data-display/StatusBadge.jsx"},{"name":"TierBadge","sourcePath":"components/data-display/TierBadge.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Modal","sourcePath":"components/surfaces/Modal.jsx"},{"name":"Toast","sourcePath":"components/surfaces/Toast.jsx"}],"sourceHashes":{"components/catalog/CartBar.jsx":"9fb8e8354530","components/catalog/ProductCard.jsx":"e69af31aa43f","components/catalog/QtyStepper.jsx":"db6148eb9201","components/data-display/Price.jsx":"ea90386c4993","components/data-display/StatCard.jsx":"3ceaa17abfc4","components/data-display/StatusBadge.jsx":"f17c35c8806e","components/data-display/TierBadge.jsx":"4359a9b8322d","components/forms/Button.jsx":"533f48ecd93d","components/forms/IconButton.jsx":"ffa90a37d5c7","components/forms/Input.jsx":"e78d10477a7e","components/forms/Select.jsx":"82ba629c116b","components/surfaces/Card.jsx":"49513a74b1e8","components/surfaces/Modal.jsx":"6cdb7fcb03fb","components/surfaces/Toast.jsx":"54882ab0400e","ui_kits/cdm-admin/AdminShell.jsx":"b2585744d48f","ui_kits/cdm-admin/DashboardView.jsx":"08d465f1edf5","ui_kits/cdm-admin/InventoryView.jsx":"3e1bfeccc782","ui_kits/cdm-admin/KonsumenView.jsx":"158570fc989d","ui_kits/cdm-admin/OrdersView.jsx":"703a53493ccc","ui_kits/katalog/Catalog.jsx":"422d743e95a5","ui_kits/staff-pwa/Staff.jsx":"a1f2f8ef0209"},"inlinedExternals":[],"unexposedExports":[{"name":"rupiah","sourcePath":"components/data-display/Price.jsx"}]} */

(() => {

const __ds_ns = (window.BrontolanoDesignSystem_7cf21c = window.BrontolanoDesignSystem_7cf21c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/catalog/CartBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-cartbar', `
.ds-cartbar {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  width: 100%;
  background: var(--commerce); color: #fff;
  border: none; border-radius: var(--radius-xl);
  padding: 14px 16px;
  font-family: var(--font-sans); font-size: 14px; cursor: pointer;
  box-shadow: var(--shadow-commerce);
  transition: background var(--dur-fast) var(--ease-out);
}
.ds-cartbar:hover { background: var(--commerce-hover); }
.ds-cartbar__count { font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }
.ds-cartbar__total { font-variant-numeric: tabular-nums; }
.ds-cartbar__cta { font-weight: 700; white-space: nowrap; }
.ds-cartbar--fixed { position: fixed; left: 12px; right: 12px; bottom: 12px; max-width: 536px; margin: 0 auto; z-index: var(--z-bar); }
`);
function rupiah(n) {
  return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
}

/** Floating green cart bar — appears when the catalog cart has items. */
function CartBar({
  count = 0,
  total = 0,
  label = 'Lihat Keranjang →',
  fixed = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: ['ds-cartbar', fixed ? 'ds-cartbar--fixed' : '', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ds-cartbar__count"
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\uD83D\uDED2"), " ", count, " item"), /*#__PURE__*/React.createElement("span", {
    className: "ds-cartbar__total"
  }, rupiah(total)), /*#__PURE__*/React.createElement("span", {
    className: "ds-cartbar__cta"
  }, label));
}
Object.assign(__ds_scope, { CartBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/CartBar.jsx", error: String((e && e.message) || e) }); }

// components/catalog/QtyStepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-stepper', `
.ds-stepper { display: inline-flex; align-items: center; gap: 6px; }
.ds-stepper__btn {
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--border-strong);
  background: var(--surface-card);
  color: var(--text);
  border-radius: var(--radius-md);
  font-weight: 700; line-height: 1; cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
}
.ds-stepper__btn:hover { background: var(--surface-hover); border-color: var(--slate-400); }
.ds-stepper__btn:active { background: var(--slate-200); }
.ds-stepper__btn:disabled { opacity: .4; cursor: not-allowed; }
.ds-stepper__input {
  text-align: center;
  font-family: var(--font-sans);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  color: var(--text);
  background: var(--surface-card);
}
.ds-stepper__input:focus { outline: none; border-color: var(--brand-400); box-shadow: 0 0 0 3px var(--focus-ring); }
.ds-stepper--sm .ds-stepper__btn { width: 30px; height: 30px; font-size: 16px; }
.ds-stepper--sm .ds-stepper__input { width: 40px; height: 30px; font-size: 14px; }
.ds-stepper--md .ds-stepper__btn { width: 38px; height: 38px; font-size: 20px; }
.ds-stepper--md .ds-stepper__input { width: 52px; height: 38px; font-size: 15px; }
.ds-stepper--block { display: flex; }
.ds-stepper--block .ds-stepper__input { flex: 1; }
`);

/** −/value/+ quantity control — catalog cards, POS rows, cart sheet. */
function QtyStepper({
  value = 0,
  onChange,
  min = 0,
  max = Infinity,
  size = 'md',
  block = false,
  className = '',
  ...rest
}) {
  const set = v => {
    if (onChange) onChange(Math.max(min, Math.min(max, v)));
  };
  const cls = ['ds-stepper', `ds-stepper--${size}`, block ? 'ds-stepper--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ds-stepper__btn",
    "aria-label": "Kurangi",
    onClick: () => set(value - 1),
    disabled: value <= min
  }, "\u2212"), /*#__PURE__*/React.createElement("input", {
    className: "ds-stepper__input",
    inputMode: "numeric",
    value: value,
    "aria-label": "Jumlah",
    onChange: e => set(parseInt(e.target.value, 10) || 0)
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ds-stepper__btn",
    "aria-label": "Tambah",
    onClick: () => set(value + 1),
    disabled: value >= max
  }, "+"));
}
Object.assign(__ds_scope, { QtyStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/QtyStepper.jsx", error: String((e && e.message) || e) }); }

// components/catalog/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-product', `
.ds-product {
  background: var(--surface-card);
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ds-product__img {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--surface-sunken);
  display: flex; align-items: center; justify-content: center;
  padding: 8px;
}
.ds-product__img img { width: 100%; height: 100%; object-fit: contain; }
.ds-product__ph { font-size: 34px; color: var(--slate-300); }
.ds-product__cat {
  position: absolute; top: 6px; left: 6px;
  background: rgba(22,163,74,.92); color: #fff;
  font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: var(--radius-pill);
}
.ds-product__hot {
  position: absolute; top: 6px; right: 6px;
  background: var(--brand-500); color: #fff;
  font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: var(--radius-pill);
}
.ds-product__body { padding: 8px 10px 10px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
.ds-product__name { font-size: 13.5px; font-weight: 600; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 34px; }
.ds-product__sku { font-size: 11px; color: var(--text-subtle); font-family: var(--font-mono); }
.ds-product__price { font-size: 16px; font-weight: 800; color: var(--text); margin-top: 2px; font-variant-numeric: tabular-nums; }
.ds-product__price .u { font-size: 11px; font-weight: 500; color: var(--text-muted); }
.ds-product__price .was { font-size: 11px; font-weight: 600; color: var(--text-subtle); text-decoration: line-through; margin-left: 5px; font-variant-numeric: tabular-nums; }
.ds-product__pcs { font-size: 12px; color: var(--green-600); font-weight: 600; font-variant-numeric: tabular-nums; }
.ds-product__save { align-self: flex-start; background: var(--green-50); color: var(--green-700); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-pill); margin-top: 1px; font-variant-numeric: tabular-nums; }
.ds-product__add {
  margin-top: 6px; width: 100%;
  background: var(--commerce); color: #fff; border: none;
  border-radius: var(--radius-md); padding: 10px 0; font-weight: 700; font-size: 14px;
  font-family: var(--font-sans); cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out);
}
.ds-product__add:hover { background: var(--commerce-hover); }
`);
function rupiah(n) {
  return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
}

/** Public-catalog product card — image, tiered price, add/stepper. */
function ProductCard({
  name,
  sku = '',
  size = '',
  category = '',
  image = null,
  price,
  perPcs = null,
  isi = null,
  hotTier = null,
  wasPrice = null,
  saving = 0,
  qty = 0,
  onQty,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['ds-product', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ds-product__img"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    loading: "lazy"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "ds-product__ph",
    "aria-hidden": "true"
  }, "\uD83D\uDCE6"), category && /*#__PURE__*/React.createElement("span", {
    className: "ds-product__cat"
  }, category), hotTier && /*#__PURE__*/React.createElement("span", {
    className: "ds-product__hot"
  }, "Tier ", hotTier, " \uD83D\uDD25")), /*#__PURE__*/React.createElement("div", {
    className: "ds-product__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-product__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "ds-product__sku"
  }, sku, size ? ` · ${size}` : ''), /*#__PURE__*/React.createElement("div", {
    className: "ds-product__price"
  }, rupiah(price), " ", /*#__PURE__*/React.createElement("span", {
    className: "u"
  }, "/karton"), wasPrice && wasPrice > price ? /*#__PURE__*/React.createElement("span", {
    className: "was"
  }, rupiah(wasPrice)) : null), perPcs != null && /*#__PURE__*/React.createElement("div", {
    className: "ds-product__pcs"
  }, "\u2248 ", rupiah(perPcs), " /pcs", isi ? ` · isi ${isi}` : ''), saving > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ds-product__save"
  }, "Hemat ", rupiah(saving), "/karton"), qty === 0 ? /*#__PURE__*/React.createElement("button", {
    className: "ds-product__add",
    onClick: () => onQty && onQty(1)
  }, "+ Keranjang") : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.QtyStepper, {
    value: qty,
    onChange: onQty,
    block: true
  }))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Price.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-price', `
.ds-price { font-family: var(--font-sans); font-variant-numeric: tabular-nums; color: var(--text); line-height: 1.15; }
.ds-price__main { font-weight: 800; letter-spacing: -0.01em; }
.ds-price__unit { font-weight: 500; color: var(--text-muted); }
.ds-price--sm .ds-price__main { font-size: var(--text-md); }
.ds-price--md .ds-price__main { font-size: var(--text-xl); }
.ds-price--lg .ds-price__main { font-size: var(--text-3xl); }
.ds-price--sm .ds-price__unit { font-size: 11px; }
.ds-price--md .ds-price__unit { font-size: var(--text-xs); }
.ds-price--lg .ds-price__unit { font-size: var(--text-sm); }
.ds-price__pcs { display: block; margin-top: 2px; font-size: var(--text-xs); font-weight: 600; color: var(--green-600); font-variant-numeric: tabular-nums; }
`);

/** Format a number as Indonesian Rupiah ("Rp 1.250.000"). */
function rupiah(n) {
  const v = Number(n) || 0;
  return 'Rp ' + v.toLocaleString('id-ID');
}

/** Rupiah price display with optional unit and per-pcs breakdown. */
function Price({
  amount,
  unit = 'karton',
  perPcs = null,
  isi = null,
  size = 'md',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['ds-price', `ds-price--${size}`, className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ds-price__main"
  }, rupiah(amount)), unit && /*#__PURE__*/React.createElement("span", {
    className: "ds-price__unit"
  }, " /", unit), perPcs != null && /*#__PURE__*/React.createElement("span", {
    className: "ds-price__pcs"
  }, "\u2248 ", rupiah(perPcs), " /pcs", isi ? ` · isi ${isi}` : ''));
}
Object.assign(__ds_scope, { rupiah, Price });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Price.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-statcard', `
.ds-stat {
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  min-width: 0;
}
.ds-stat__top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.ds-stat__label { color: var(--text-muted); font-size: var(--text-sm); font-weight: 500; }
.ds-stat__icon { font-size: 16px; opacity: .9; }
.ds-stat__value { font-size: var(--text-3xl); font-weight: 800; letter-spacing: -0.01em; margin-top: var(--space-1); font-variant-numeric: tabular-nums; color: var(--text); }
.ds-stat__delta { font-size: var(--text-xs); font-weight: 600; margin-top: 2px; }
.ds-stat__delta--up { color: var(--green-600); }
.ds-stat__delta--down { color: var(--danger); }
.ds-stat--accent { border-top: 3px solid var(--brand-500); }
`);

/** Dashboard summary tile (Konsumen Aktif, Omset Bulan Ini, Piutang…). */
function StatCard({
  label,
  value,
  icon = null,
  delta = null,
  deltaDir = 'up',
  accent = false,
  className = '',
  ...rest
}) {
  const cls = ['ds-stat', accent ? 'ds-stat--accent' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ds-stat__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-stat__label"
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    className: "ds-stat__icon",
    "aria-hidden": "true"
  }, icon)), /*#__PURE__*/React.createElement("div", {
    className: "ds-stat__value"
  }, value), delta != null && /*#__PURE__*/React.createElement("div", {
    className: `ds-stat__delta ds-stat__delta--${deltaDir}`
  }, deltaDir === 'up' ? '▲' : '▼', " ", delta));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-badge', `
.ds-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  white-space: nowrap;
  line-height: 1.4;
  text-transform: capitalize;
}
`);

// status token → [bg, fg]
const MAP = {
  draft: ['--badge-draft-bg', '--badge-draft-fg'],
  confirmed: ['--badge-confirmed-bg', '--badge-confirmed-fg'],
  proses: ['--badge-proses-bg', '--badge-proses-fg'],
  dikirim: ['--badge-dikirim-bg', '--badge-dikirim-fg'],
  selesai: ['--badge-selesai-bg', '--badge-selesai-fg'],
  dibatalkan: ['--badge-batal-bg', '--badge-batal-fg'],
  lunas: ['--badge-lunas-bg', '--badge-lunas-fg'],
  sebagian: ['--badge-sebagian-bg', '--badge-sebagian-fg'],
  belum: ['--badge-belum-bg', '--badge-belum-fg'],
  aktif: ['--badge-aktif-bg', '--badge-aktif-fg'],
  tidak_aktif: ['--badge-nonaktif-bg', '--badge-nonaktif-fg']
};

/** Domain status pill — colors itself from the status string. */
function StatusBadge({
  status,
  children,
  className = '',
  ...rest
}) {
  const key = String(status || '').toLowerCase();
  const [bg, fg] = MAP[key] || MAP.draft;
  const label = children != null ? children : key.replace('_', ' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['ds-badge', className].filter(Boolean).join(' '),
    style: {
      background: `var(${bg})`,
      color: `var(${fg})`
    }
  }, rest), label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/TierBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-tier', `
.ds-tier {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--text-2xs);
  letter-spacing: .02em;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
  background: var(--surface-sunken);
  color: var(--text-muted);
  border: 1px solid var(--border);
  white-space: nowrap;
}
.ds-tier--active { background: var(--green-50); color: var(--green-600); border-color: var(--green-200); }
.ds-tier--hot { background: var(--brand-500); color: #fff; border-color: var(--brand-500); }
.ds-tier__range { font-weight: 500; opacity: .8; }
`);
const RANGES = {
  HET: '1–5',
  S1: '6–9',
  S2: '10–24',
  S3: '25–150',
  S4: '>150'
};

/** Wholesale tier pill (HET·S1–S4). `hot` = an active discount (brand red). */
function TierBadge({
  tier = 'HET',
  range = false,
  hot = false,
  active = false,
  className = '',
  ...rest
}) {
  const key = String(tier).toUpperCase();
  const cls = ['ds-tier', hot ? 'ds-tier--hot' : active ? 'ds-tier--active' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), hot && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\uD83D\uDD25"), key, range && /*#__PURE__*/React.createElement("span", {
    className: "ds-tier__range"
  }, RANGES[key] || '', " krtn"));
}
Object.assign(__ds_scope, { TierBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/TierBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-button', `
.ds-btn {
  font-family: var(--font-sans);
  font-weight: var(--weight-semibold);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  transition: background var(--dur-fast) var(--ease-out),
              box-shadow var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out);
}
.ds-btn--sm { padding: 6px 12px; font-size: var(--text-sm); border-radius: var(--radius-sm); }
.ds-btn--md { padding: 9px 16px; font-size: var(--text-base); }
.ds-btn--lg { padding: 13px 20px; font-size: var(--text-lg); border-radius: var(--radius-md); }
.ds-btn--block { display: flex; width: 100%; }
.ds-btn:disabled, .ds-btn[aria-disabled="true"] { opacity: .5; cursor: not-allowed; pointer-events: none; }
.ds-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--focus-ring); }
.ds-btn svg { width: 1.05em; height: 1.05em; }

.ds-btn--primary { background: var(--primary); color: var(--primary-fg); }
.ds-btn--primary:hover { background: var(--primary-hover); }
.ds-btn--primary:active { background: var(--primary-active); }

.ds-btn--secondary { background: var(--slate-200); color: var(--text); }
.ds-btn--secondary:hover { background: var(--slate-300); }

.ds-btn--ghost { background: transparent; color: var(--text); border-color: var(--border-strong); }
.ds-btn--ghost:hover { background: var(--surface-hover); }

.ds-btn--danger { background: var(--danger); color: #fff; }
.ds-btn--danger:hover { background: var(--danger-hover); }

.ds-btn--commerce { background: var(--commerce); color: #fff; }
.ds-btn--commerce:hover { background: var(--commerce-hover); }

.ds-btn--whatsapp { background: var(--wa-green); color: #0b3d1c; font-weight: var(--weight-bold); }
.ds-btn--whatsapp:hover { background: var(--wa-green-dark); color: #fff; }
`);

/**
 * Brontolano primary button. Red is the brand action; commerce green and
 * WhatsApp are the catalog's order actions; danger is destructive only.
 */
function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  iconLeft = null,
  iconRight = null,
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  const cls = ['ds-btn', `ds-btn--${variant}`, `ds-btn--${size}`, block ? 'ds-btn--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls
  }, rest), iconLeft, children != null && /*#__PURE__*/React.createElement("span", null, children), iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-iconbutton', `
.ds-iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.ds-iconbtn--sm { width: 32px; height: 32px; font-size: 16px; }
.ds-iconbtn--md { width: 38px; height: 38px; font-size: 19px; }
.ds-iconbtn--lg { width: 44px; height: 44px; font-size: 22px; }
.ds-iconbtn:hover { background: var(--surface-hover); }
.ds-iconbtn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--focus-ring); }
.ds-iconbtn:disabled { opacity: .45; cursor: not-allowed; }
.ds-iconbtn--outline { border-color: var(--border-strong); background: var(--surface-card); }
.ds-iconbtn--outline:hover { background: var(--surface-hover); }
.ds-iconbtn svg { width: 1em; height: 1em; }
`);

/**
 * Square, ≥44px-friendly icon button — steppers, close ✕, back ‹, row actions.
 * Always pass an aria-label since there is no text.
 */
function IconButton({
  size = 'md',
  outline = false,
  label,
  className = '',
  children,
  ...rest
}) {
  const cls = ['ds-iconbtn', `ds-iconbtn--${size}`, outline ? 'ds-iconbtn--outline' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-label": label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-input', `
.ds-field { margin-bottom: var(--space-3); display: block; }
.ds-field__label { display: block; font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-1); color: var(--text); }
.ds-field__req { color: var(--danger); margin-left: 2px; }
.ds-field__wrap { position: relative; display: flex; align-items: center; }
.ds-field__control {
  width: 100%;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--text);
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 9px 11px;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-field__control::placeholder { color: var(--text-subtle); }
.ds-field__control:hover { border-color: var(--border-strong); }
.ds-field__control:focus { outline: none; border-color: var(--brand-400); box-shadow: 0 0 0 3px var(--focus-ring); }
.ds-field__control:disabled { background: var(--surface-sunken); color: var(--text-muted); cursor: not-allowed; }
.ds-field--has-prefix .ds-field__control { padding-left: 30px; }
.ds-field__affix { position: absolute; color: var(--text-muted); font-size: var(--text-sm); pointer-events: none; }
.ds-field__affix--prefix { left: 11px; }
.ds-field--error .ds-field__control { border-color: var(--danger); }
.ds-field--error .ds-field__control:focus { box-shadow: 0 0 0 3px var(--danger-50); }
.ds-field__msg { font-size: var(--text-xs); margin-top: var(--space-1); }
.ds-field__msg--err { color: var(--danger); }
.ds-field__msg--hint { color: var(--text-muted); }
`);

/** Labelled text field — the back-office/form workhorse. */
function Input({
  label,
  hint,
  error,
  required = false,
  prefix = null,
  id,
  className = '',
  ...rest
}) {
  const fid = id || (label ? 'ds-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const cls = ['ds-field', prefix ? 'ds-field--has-prefix' : '', error ? 'ds-field--error' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "ds-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "ds-field__req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "ds-field__wrap"
  }, prefix && /*#__PURE__*/React.createElement("span", {
    className: "ds-field__affix ds-field__affix--prefix"
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: "ds-field__control",
    "aria-invalid": !!error
  }, rest))), error ? /*#__PURE__*/React.createElement("div", {
    className: "ds-field__msg ds-field__msg--err"
  }, error) : hint ? /*#__PURE__*/React.createElement("div", {
    className: "ds-field__msg ds-field__msg--hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-select', `
.ds-select__wrap { position: relative; display: block; }
.ds-select {
  width: 100%;
  appearance: none;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--text);
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 9px 34px 9px 11px;
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-select:hover { border-color: var(--border-strong); }
.ds-select:focus { outline: none; border-color: var(--brand-400); box-shadow: 0 0 0 3px var(--focus-ring); }
.ds-select:disabled { background: var(--surface-sunken); color: var(--text-muted); cursor: not-allowed; }
.ds-select__caret { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); font-size: 11px; }
`);

/** Native select with the brand chrome (caret, focus ring). */
function Select({
  options = [],
  placeholder,
  className = '',
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-select__wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: ['ds-select', className].filter(Boolean).join(' ')
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), children, options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const label = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, label);
  })), /*#__PURE__*/React.createElement("span", {
    className: "ds-select__caret"
  }, "\u25BC"));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-card', `
.ds-card {
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
.ds-card--flush { padding: 0; }
.ds-card--accent { border-top: 3px solid var(--brand-500); }
.ds-card--interactive { cursor: pointer; transition: box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
.ds-card--interactive:hover { box-shadow: var(--shadow-md); border-color: var(--border-strong); transform: translateY(-1px); }
.ds-card__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-bottom: var(--space-3); }
.ds-card--flush .ds-card__head { padding: var(--space-4) var(--space-4) 0; margin-bottom: var(--space-3); }
.ds-card__title { font-size: var(--text-lg); font-weight: 700; letter-spacing: var(--tracking-tight); margin: 0; }
`);

/** The white, hairline-bordered container that holds almost everything. */
function Card({
  title = null,
  actions = null,
  flush = false,
  accent = false,
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['ds-card', flush ? 'ds-card--flush' : '', accent ? 'ds-card--accent' : '', interactive ? 'ds-card--interactive' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), (title || actions) && /*#__PURE__*/React.createElement("div", {
    className: "ds-card__head"
  }, title && /*#__PURE__*/React.createElement("h3", {
    className: "ds-card__title"
  }, title), actions), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Modal.jsx
try { (() => {
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-modal', `
.ds-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex; align-items: center; justify-content: center;
  padding: var(--space-4);
  z-index: var(--z-overlay);
  animation: ds-modal-fade var(--dur-base) var(--ease-out);
}
.ds-modal {
  background: var(--surface-card);
  border-radius: var(--radius-lg);
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: var(--shadow-xl);
  animation: ds-modal-pop var(--dur-base) var(--ease-out);
}
.ds-modal__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-5) var(--space-5) var(--space-3); }
.ds-modal__title { font-size: var(--text-xl); font-weight: 700; letter-spacing: var(--tracking-tight); margin: 0; }
.ds-modal__close { border: none; background: transparent; font-size: 20px; line-height: 1; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: var(--radius-sm); }
.ds-modal__close:hover { background: var(--surface-hover); color: var(--text); }
.ds-modal__body { padding: 0 var(--space-5) var(--space-5); }
.ds-modal__foot { display: flex; gap: var(--space-3); justify-content: flex-end; padding: var(--space-3) var(--space-5) var(--space-5); }
@keyframes ds-modal-fade { from { opacity: 0; } }
@keyframes ds-modal-pop { from { opacity: 0; transform: translateY(8px) scale(.98); } }
`);

/** Centered dialog over a scrim. Click-scrim and Esc close. */
function Modal({
  title,
  onClose,
  footer = null,
  width = 520,
  children
}) {
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-modal-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-modal",
    style: {
      maxWidth: width
    },
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-modal__head"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "ds-modal__title"
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    className: "ds-modal__close",
    "aria-label": "Tutup",
    onClick: onClose
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "ds-modal__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "ds-modal__foot"
  }, footer)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Modal.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
injectOnce('ds-toast', `
.ds-toast {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 12px 18px;
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: var(--text-base);
  font-weight: 600;
  box-shadow: var(--shadow-md);
  max-width: 360px;
}
.ds-toast__icon { font-size: 15px; }
.ds-toast--success { background: var(--success); }
.ds-toast--error { background: var(--danger); }
.ds-toast--info { background: var(--info); }
.ds-toast--warning { background: var(--warning); }
.ds-toast-wrap { position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: var(--space-2); z-index: var(--z-toast); }
`);
const ICON = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠'
};

/** A single toast notification (bottom-right of the back-office). */
function Toast({
  type = 'info',
  children,
  icon,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['ds-toast', `ds-toast--${type}`, className].filter(Boolean).join(' '),
    role: "status"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ds-toast__icon",
    "aria-hidden": "true"
  }, icon != null ? icon : ICON[type]), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Toast.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cdm-admin/AdminShell.jsx
try { (() => {
// CDM Admin shell — slate sidebar + sticky topbar. Reads DS components
// from the global namespace; exports <AdminShell> + <Icon> to window.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

// Robust Lucide-in-React icon: React owns the <span>, Lucide mutates inside
// it imperatively, so re-renders never touch replaced DOM nodes.
function Icon({
  name,
  className
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    try {
      window.lucide.createIcons();
    } catch (e) {}
  }, [name]);
  return React.createElement('span', {
    ref,
    className: 'ic' + (className ? ' ' + className : ''),
    'aria-hidden': true
  });
}
window.Icon = Icon;
const NAV = [{
  key: 'dashboard',
  label: 'Dashboard',
  icon: 'layout-dashboard'
}, {
  key: 'konsumen',
  label: 'Konsumen',
  icon: 'store'
}, {
  key: 'inventory',
  label: 'Inventory',
  icon: 'package'
}, {
  key: 'pesanan',
  label: 'Pesanan Masuk',
  icon: 'inbox'
}, {
  key: 'orders',
  label: 'Orders',
  icon: 'receipt'
}, {
  key: 'invoices',
  label: 'Invoices',
  icon: 'banknote'
}, {
  key: 'pengiriman',
  label: 'Pengiriman',
  icon: 'truck'
}, {
  key: 'broadcasting',
  label: 'Broadcast WA',
  icon: 'message-circle'
}, {
  key: 'users',
  label: 'Manajemen User',
  icon: 'users'
}];
function AdminShell({
  active,
  onNav,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adm"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "adm__side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brontolano-mark.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "adm__brandtext"
  }, /*#__PURE__*/React.createElement("strong", null, "Brontolano"), /*#__PURE__*/React.createElement("span", null, "CDM Admin"))), /*#__PURE__*/React.createElement("nav", {
    className: "adm__nav"
  }, NAV.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.key,
    className: 'adm__navitem' + (active === n.key ? ' is-active' : ''),
    onClick: () => onNav(n.key)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon
  }), /*#__PURE__*/React.createElement("span", null, n.label)))), /*#__PURE__*/React.createElement("div", {
    className: "adm__sidefoot"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "life-buoy"
  }), /*#__PURE__*/React.createElement("span", null, "Bantuan"))), /*#__PURE__*/React.createElement("div", {
    className: "adm__main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "adm__top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm__search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Cari konsumen, order, barang\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "adm__user"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adm__icon",
    "aria-label": "Notifikasi"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell"
  })), /*#__PURE__*/React.createElement("div", {
    className: "adm__userbox"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm__avatar"
  }, "RB"), /*#__PURE__*/React.createElement("div", {
    className: "adm__usermeta"
  }, /*#__PURE__*/React.createElement("strong", null, "Rizal Bahri"), /*#__PURE__*/React.createElement("span", {
    className: "adm__role"
  }, "admin"))))), /*#__PURE__*/React.createElement("main", {
    className: "adm__content"
  }, children)));
}
window.AdminShell = AdminShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cdm-admin/AdminShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cdm-admin/DashboardView.jsx
try { (() => {
// Dashboard — summary stats, omset chart, recent orders, top barang, piutang.
const NS = window.BrontolanoDesignSystem_7cf21c || {};
function DashboardView() {
  const {
    StatCard,
    Card,
    StatusBadge
  } = NS;
  const Icon = window.Icon;
  const rupiah = n => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
  const omset = [{
    p: 'Sen',
    v: 4200000
  }, {
    p: 'Sel',
    v: 5100000
  }, {
    p: 'Rab',
    v: 3800000
  }, {
    p: 'Kam',
    v: 6400000
  }, {
    p: 'Jum',
    v: 7200000
  }, {
    p: 'Sab',
    v: 8800000
  }, {
    p: 'Min',
    v: 2600000
  }];
  const max = Math.max(...omset.map(o => o.v));
  const orders = [{
    no: 'ORD-00231',
    toko: 'Toko Berkah Jaya',
    total: 1240000,
    status: 'dikirim'
  }, {
    no: 'ORD-00230',
    toko: 'Warung Bu Sri',
    total: 486000,
    status: 'selesai'
  }, {
    no: 'ORD-00229',
    toko: 'Grosir Makmur',
    total: 3180000,
    status: 'confirmed'
  }, {
    no: 'ORD-00228',
    toko: 'Toko Sumber Rezeki',
    total: 742000,
    status: 'proses'
  }];
  const top = [{
    nama: 'Indomie Goreng Spesial',
    qty: 320,
    omset: 18560000
  }, {
    nama: 'MinyaKita 1L',
    qty: 145,
    omset: 22765000
  }, {
    nama: 'Gula Pasir Gulaku 1kg',
    qty: 96,
    omset: 16704000
  }];
  const aging = [{
    label: 'Belum jatuh tempo',
    v: 8400000,
    tone: ''
  }, {
    label: 'Telat 1–7 hari',
    v: 2100000,
    tone: 'warn'
  }, {
    label: 'Telat 8–30 hari',
    v: 950000,
    tone: 'warn'
  }, {
    label: 'Telat >30 hari',
    v: 430000,
    tone: 'bad'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "view__head"
  }, /*#__PURE__*/React.createElement("h2", null, "Dashboard"), /*#__PURE__*/React.createElement("span", {
    className: "view__sub"
  }, "Ringkasan operasional \xB7 Juni 2026")), /*#__PURE__*/React.createElement("div", {
    className: "statgrid"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Konsumen Aktif",
    value: "128",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "store"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Total Order",
    value: "231",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "receipt"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Omset Bulan Ini",
    value: rupiah(38120000),
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "trending-up"
    }),
    accent: true,
    delta: "12%",
    deltaDir: "up"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Laba Kotor",
    value: rupiah(4870000),
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "hand-coins"
    }),
    delta: "3,4%",
    deltaDir: "up"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Piutang",
    value: rupiah(11880000),
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "hourglass"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Stok Rendah",
    value: "6",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "package"
    }),
    delta: "2 baru",
    deltaDir: "down"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cols2"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Omset (Lunas) \u2014 Mingguan"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chart"
  }, omset.map(o => /*#__PURE__*/React.createElement("div", {
    className: "chart__col",
    key: o.p
  }, /*#__PURE__*/React.createElement("div", {
    className: "chart__bar",
    style: {
      height: o.v / max * 130 + 'px'
    },
    title: rupiah(o.v)
  }), /*#__PURE__*/React.createElement("span", {
    className: "chart__lbl"
  }, o.p))))), /*#__PURE__*/React.createElement(Card, {
    title: "Barang Terlaris"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Barang"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Terjual"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Omset"))), /*#__PURE__*/React.createElement("tbody", null, top.map(b => /*#__PURE__*/React.createElement("tr", {
    key: b.nama
  }, /*#__PURE__*/React.createElement("td", null, b.nama), /*#__PURE__*/React.createElement("td", {
    className: "r tnum"
  }, b.qty), /*#__PURE__*/React.createElement("td", {
    className: "r tnum"
  }, rupiah(b.omset)))))))), /*#__PURE__*/React.createElement("div", {
    className: "cols2"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Order Terbaru",
    flush: true
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "No. Order"), /*#__PURE__*/React.createElement("th", null, "Toko"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Total"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, orders.map(o => /*#__PURE__*/React.createElement("tr", {
    key: o.no
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, o.no), /*#__PURE__*/React.createElement("td", null, o.toko), /*#__PURE__*/React.createElement("td", {
    className: "r tnum"
  }, rupiah(o.total)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
    status: o.status
  }))))))), /*#__PURE__*/React.createElement(Card, {
    title: "Piutang \u2014 Aging"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aging"
  }, aging.map(a => /*#__PURE__*/React.createElement("div", {
    className: 'aging__row' + (a.tone ? ' is-' + a.tone : ''),
    key: a.label
  }, /*#__PURE__*/React.createElement("span", null, a.label), /*#__PURE__*/React.createElement("strong", {
    className: "tnum"
  }, rupiah(a.v))))))));
}
window.DashboardView = DashboardView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cdm-admin/DashboardView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cdm-admin/InventoryView.jsx
try { (() => {
// Inventory — stock list with tiered wholesale pricing + low-stock tint.
const NS = window.BrontolanoDesignSystem_7cf21c || {};
function InventoryView() {
  const {
    Card,
    Button,
    TierBadge
  } = NS;
  const rupiah = n => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
  const Icon = window.Icon;
  const rows = [{
    sku: 'MKG-0012',
    nama: 'Indomie Goreng Spesial',
    size: 'Karton · isi 40',
    kat: 'Mie Instan',
    het: 116000,
    s4: 110000,
    stok: 84,
    min: 20,
    cap: false
  }, {
    sku: 'SMB-0033',
    nama: 'MinyaKita Minyak Goreng 1L',
    size: 'Karton · isi 12',
    kat: 'Sembako',
    het: 188000,
    s4: 184000,
    stok: 12,
    min: 24,
    cap: true
  }, {
    sku: 'SMB-0007',
    nama: 'Gula Pasir Gulaku 1kg',
    size: 'Karton · isi 12',
    kat: 'Sembako',
    het: 174000,
    s4: 168000,
    stok: 56,
    min: 15,
    cap: false
  }, {
    sku: 'SMB-0019',
    nama: 'Beras Pandan Wangi 5kg',
    size: 'Sak',
    kat: 'Sembako',
    het: 72000,
    s4: 69000,
    stok: 8,
    min: 10,
    cap: false
  }, {
    sku: 'MNM-0004',
    nama: 'Teh Pucuk Harum 350ml',
    size: 'Karton · isi 24',
    kat: 'Minuman',
    het: 49000,
    s4: 46000,
    stok: 132,
    min: 30,
    cap: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "view__head"
  }, /*#__PURE__*/React.createElement("h2", null, "Inventory"), /*#__PURE__*/React.createElement("span", {
    className: "view__sub"
  }, "5 dari 214 barang")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toolbar__filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "chip is-active"
  }, "Semua"), /*#__PURE__*/React.createElement("button", {
    className: "chip"
  }, "Sembako"), /*#__PURE__*/React.createElement("button", {
    className: "chip"
  }, "Mie Instan"), /*#__PURE__*/React.createElement("button", {
    className: "chip"
  }, "Minuman")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar__actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "upload"
    })
  }, "Export CSV"), /*#__PURE__*/React.createElement(Button, {
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus"
    })
  }, "Barang"))), /*#__PURE__*/React.createElement(Card, {
    flush: true
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "SKU"), /*#__PURE__*/React.createElement("th", null, "Barang"), /*#__PURE__*/React.createElement("th", null, "Kategori"), /*#__PURE__*/React.createElement("th", null, "Harga grosir (HET \u2192 S4)"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Stok"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => {
    const low = r.stok < r.min;
    return /*#__PURE__*/React.createElement("tr", {
      key: r.sku,
      className: low ? 'row-low' : ''
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono"
    }, r.sku), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, r.nama), /*#__PURE__*/React.createElement("div", {
      className: "muted sm"
    }, r.size)), /*#__PURE__*/React.createElement("td", null, r.kat), /*#__PURE__*/React.createElement("td", {
      className: "nowrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tnum"
    }, rupiah(r.het)), /*#__PURE__*/React.createElement("span", {
      className: "muted"
    }, " \u2192 ", rupiah(r.s4)), r.cap && /*#__PURE__*/React.createElement("span", {
      className: "hetcap",
      title: "Dibatasi HET pemerintah"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock"
    }), " HET")), /*#__PURE__*/React.createElement("td", {
      className: "r"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "tnum"
    }, r.stok), low && /*#__PURE__*/React.createElement(Icon, {
      name: "alert-triangle",
      className: "warn-ic"
    })), /*#__PURE__*/React.createElement("td", {
      className: "r nowrap"
    }, /*#__PURE__*/React.createElement(TierBadge, {
      tier: "S2"
    }), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost"
    }, "+ Masuk")));
  })))));
}
window.InventoryView = InventoryView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cdm-admin/InventoryView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cdm-admin/KonsumenView.jsx
try { (() => {
// Konsumen — searchable list of shops with status + row actions.
const NS = window.BrontolanoDesignSystem_7cf21c || {};
function KonsumenView() {
  const {
    Card,
    Button,
    Input,
    StatusBadge
  } = NS;
  const Icon = window.Icon;
  const rows = [{
    toko: 'Toko Berkah Jaya',
    pemilik: 'H. Supriyadi',
    wa: '+62 812 3456 7890',
    kota: 'Sumedang',
    status: 'aktif',
    gps: true
  }, {
    toko: 'Warung Bu Sri',
    pemilik: 'Sri Wahyuni',
    wa: '+62 813 9988 1122',
    kota: 'Sumedang',
    status: 'aktif',
    gps: true
  }, {
    toko: 'Grosir Makmur',
    pemilik: 'Andi Pratama',
    wa: '+62 856 7766 5544',
    kota: 'Bandung',
    status: 'aktif',
    gps: false
  }, {
    toko: 'Toko Sumber Rezeki',
    pemilik: 'Dewi Lestari',
    wa: '+62 878 1234 5678',
    kota: 'Cimahi',
    status: 'tidak_aktif',
    gps: true
  }, {
    toko: 'Kios Pak Joko',
    pemilik: 'Joko Susilo',
    wa: '+62 821 4455 6677',
    kota: 'Sumedang',
    status: 'aktif',
    gps: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "view__head"
  }, /*#__PURE__*/React.createElement("h2", null, "Data Konsumen"), /*#__PURE__*/React.createElement("span", {
    className: "view__sub"
  }, "128 toko terdaftar")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toolbar__search"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Cari toko / pemilik / WA\u2026"
  })), /*#__PURE__*/React.createElement(Button, {
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus"
    })
  }, "Konsumen")), /*#__PURE__*/React.createElement(Card, {
    flush: true
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Toko"), /*#__PURE__*/React.createElement("th", null, "Pemilik"), /*#__PURE__*/React.createElement("th", null, "Kontak WA"), /*#__PURE__*/React.createElement("th", null, "Kota"), /*#__PURE__*/React.createElement("th", null, "GPS"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.toko
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, r.toko)), /*#__PURE__*/React.createElement("td", null, r.pemilik), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, r.wa), /*#__PURE__*/React.createElement("td", null, r.kota), /*#__PURE__*/React.createElement("td", null, r.gps ? /*#__PURE__*/React.createElement("a", {
    className: "gpslink",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin"
  }), " Arah") : /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "\u2014")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
    status: r.status
  })), /*#__PURE__*/React.createElement("td", {
    className: "r nowrap"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost"
  }, "Edit"))))))));
}
window.KonsumenView = KonsumenView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cdm-admin/KonsumenView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cdm-admin/OrdersView.jsx
try { (() => {
// Orders — order list with status filter chips.
const NS = window.BrontolanoDesignSystem_7cf21c || {};
function OrdersView() {
  const {
    Card,
    Button,
    StatusBadge
  } = NS;
  const rupiah = n => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
  const Icon = window.Icon;
  const rows = [{
    no: 'ORD-00231',
    toko: 'Toko Berkah Jaya',
    items: 6,
    total: 1240000,
    tgl: '27 Jun',
    status: 'dikirim'
  }, {
    no: 'ORD-00230',
    toko: 'Warung Bu Sri',
    items: 3,
    total: 486000,
    tgl: '27 Jun',
    status: 'selesai'
  }, {
    no: 'ORD-00229',
    toko: 'Grosir Makmur',
    items: 14,
    total: 3180000,
    tgl: '26 Jun',
    status: 'confirmed'
  }, {
    no: 'ORD-00228',
    toko: 'Toko Sumber Rezeki',
    items: 4,
    total: 742000,
    tgl: '26 Jun',
    status: 'proses'
  }, {
    no: 'ORD-00227',
    toko: 'Kios Pak Joko',
    items: 2,
    total: 198000,
    tgl: '25 Jun',
    status: 'draft'
  }, {
    no: 'ORD-00226',
    toko: 'Toko Berkah Jaya',
    items: 9,
    total: 2040000,
    tgl: '24 Jun',
    status: 'dibatalkan'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "view__head"
  }, /*#__PURE__*/React.createElement("h2", null, "Orders"), /*#__PURE__*/React.createElement("span", {
    className: "view__sub"
  }, "231 order bulan ini")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toolbar__filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "chip is-active"
  }, "Semua"), /*#__PURE__*/React.createElement("button", {
    className: "chip"
  }, "Draft"), /*#__PURE__*/React.createElement("button", {
    className: "chip"
  }, "Confirmed"), /*#__PURE__*/React.createElement("button", {
    className: "chip"
  }, "Proses"), /*#__PURE__*/React.createElement("button", {
    className: "chip"
  }, "Dikirim"), /*#__PURE__*/React.createElement("button", {
    className: "chip"
  }, "Selesai")), /*#__PURE__*/React.createElement(Button, {
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus"
    })
  }, "Order Baru")), /*#__PURE__*/React.createElement(Card, {
    flush: true
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "No. Order"), /*#__PURE__*/React.createElement("th", null, "Toko"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Item"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Total"), /*#__PURE__*/React.createElement("th", null, "Tanggal"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(o => /*#__PURE__*/React.createElement("tr", {
    key: o.no
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, o.no), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, o.toko)), /*#__PURE__*/React.createElement("td", {
    className: "r tnum"
  }, o.items), /*#__PURE__*/React.createElement("td", {
    className: "r tnum"
  }, rupiah(o.total)), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, o.tgl), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
    status: o.status
  })), /*#__PURE__*/React.createElement("td", {
    className: "r"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost"
  }, "Lihat"))))))));
}
window.OrdersView = OrdersView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cdm-admin/OrdersView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/katalog/Catalog.jsx
try { (() => {
// Katalog Brontolano — public mobile storefront + consumer account.
// Marketing 7.0 voice. Adds: WhatsApp login/signup, profile, order history
// & status timeline, and a payment step (COD primary; QRIS/Transfer/VA
// secondary — admin-configurable). Exports <Catalog> to window.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

// Robust Lucide-in-React icon: React owns the <span>, Lucide mutates inside.
function Icon({
  name,
  className
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    try {
      window.lucide.createIcons();
    } catch (e) {}
  }, [name]);
  return React.createElement('span', {
    ref,
    className: 'ic' + (className ? ' ' + className : ''),
    'aria-hidden': true
  });
}

// Tiered wholesale price: HET 1–5, S1 6–9, S2 10–24, S3 25–150, S4 >150 cartons.
function priceForQty(p, qty) {
  if (qty >= 151) return p.s4;
  if (qty >= 25) return p.s3;
  if (qty >= 10) return p.s2;
  if (qty >= 6) return p.s1;
  return p.het;
}
function tierForQty(qty) {
  if (qty >= 151) return 'S4';
  if (qty >= 25) return 'S3';
  if (qty >= 10) return 'S2';
  if (qty >= 6) return 'S1';
  return 'HET';
}
const initials = n => (n || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
const PRODUCTS = [{
  id: 'p1',
  nama: 'Indomie Goreng Spesial',
  sku: 'MKG-0012',
  kategori: 'Mie Instan',
  isi: 40,
  het: 116000,
  s1: 114000,
  s2: 112000,
  s3: 111000,
  s4: 110000
}, {
  id: 'p2',
  nama: 'MinyaKita Minyak Goreng 1L',
  sku: 'SMB-0033',
  kategori: 'Sembako',
  isi: 12,
  het: 188000,
  s1: 187000,
  s2: 186000,
  s3: 185000,
  s4: 184000
}, {
  id: 'p3',
  nama: 'Gula Pasir Gulaku 1kg',
  sku: 'SMB-0007',
  kategori: 'Sembako',
  isi: 12,
  het: 174000,
  s1: 172000,
  s2: 170000,
  s3: 169000,
  s4: 168000
}, {
  id: 'p4',
  nama: 'Teh Pucuk Harum 350ml',
  sku: 'MNM-0004',
  kategori: 'Minuman',
  isi: 24,
  het: 49000,
  s1: 48000,
  s2: 47000,
  s3: 46500,
  s4: 46000
}, {
  id: 'p5',
  nama: 'Kopi Kapal Api Special 165g',
  sku: 'MNM-0021',
  kategori: 'Minuman',
  isi: 20,
  het: 84000,
  s1: 82500,
  s2: 81000,
  s3: 80000,
  s4: 79000
}, {
  id: 'p6',
  nama: 'Sabun Lifebuoy Merah 110g',
  sku: 'NFD-0009',
  kategori: 'Non-Food',
  isi: 48,
  het: 132000,
  s1: 130000,
  s2: 128000,
  s3: 127000,
  s4: 126000
}];
const CATS = [{
  name: 'Semua Kategori',
  v: 'Semua'
}, {
  name: 'Sembako',
  v: 'Sembako'
}, {
  name: 'Mie Instan',
  v: 'Mie Instan'
}, {
  name: 'Minuman',
  v: 'Minuman'
}, {
  name: 'Non-Food',
  v: 'Non-Food'
}];
const TRUST = [{
  ic: 'badge-percent',
  t: 'Harga pabrik'
}, {
  ic: 'truck',
  t: 'Kirim cepat'
}, {
  ic: 'message-circle',
  t: 'Order via WA'
}];
// Payment methods — `enabled` mirrors the admin-panel toggle. COD is primary.
const PAYMENTS = [{
  id: 'cod',
  name: 'COD — Bayar di Tempat',
  desc: 'Tunai saat barang tiba',
  icon: 'hand-coins',
  primary: true,
  enabled: true
}, {
  id: 'qris',
  name: 'QRIS',
  desc: 'Scan QR · semua e-wallet & bank',
  icon: 'qr-code',
  enabled: true
}, {
  id: 'transfer',
  name: 'Transfer Bank',
  desc: 'BCA · BRI · Mandiri',
  icon: 'building-2',
  enabled: true
}, {
  id: 'va',
  name: 'Virtual Account',
  desc: 'Pembayaran VA otomatis',
  icon: 'landmark',
  enabled: true
}, {
  id: 'card',
  name: 'Kartu Kredit/Debit',
  desc: 'Dinonaktifkan oleh admin',
  icon: 'credit-card',
  enabled: false
}];
const payName = id => (PAYMENTS.find(p => p.id === id) || {}).name || '';
// Order status flow for the timeline.
const FLOW = [{
  k: 'dikonfirmasi',
  label: 'Dikonfirmasi',
  ic: 'clipboard-check'
}, {
  k: 'proses',
  label: 'Disiapkan',
  ic: 'package'
}, {
  k: 'dikirim',
  label: 'Dikirim',
  ic: 'truck'
}, {
  k: 'selesai',
  label: 'Selesai',
  ic: 'party-popper'
}];
const stepOf = s => ({
  menunggu: -1,
  dikonfirmasi: 0,
  proses: 1,
  dikirim: 2,
  selesai: 3
})[s] ?? 0;
const ORDERS0 = [{
  no: 'ORD-00231',
  tgl: '27 Jun 2026',
  total: 1240000,
  status: 'dikirim',
  bayar: 'COD — Bayar di Tempat',
  items: 6
}, {
  no: 'ORD-00198',
  tgl: '20 Jun 2026',
  total: 486000,
  status: 'selesai',
  bayar: 'QRIS',
  items: 3
}, {
  no: 'ORD-00154',
  tgl: '12 Jun 2026',
  total: 3180000,
  status: 'selesai',
  bayar: 'Transfer Bank',
  items: 14
}];
function StatusBadgeFor({
  status
}) {
  const {
    StatusBadge
  } = NS;
  const map = {
    menunggu: 'draft',
    dikonfirmasi: 'confirmed',
    proses: 'proses',
    dikirim: 'dikirim',
    selesai: 'selesai'
  };
  const label = {
    menunggu: 'menunggu',
    dikonfirmasi: 'dikonfirmasi',
    proses: 'diproses',
    dikirim: 'dikirim',
    selesai: 'selesai'
  };
  return /*#__PURE__*/React.createElement(StatusBadge, {
    status: map[status] || 'draft'
  }, label[status] || status);
}
function Catalog() {
  const {
    ProductCard,
    CartBar,
    QtyStepper,
    Button,
    Input
  } = NS;
  const rupiah = n => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
  const {
    useState,
    useMemo
  } = React;
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Semua');
  const [catOpen, setCatOpen] = useState(false);
  const [cart, setCart] = useState({
    p1: 12
  });
  const [sheet, setSheet] = useState(null); // null | 'cart' | 'checkout' | 'done'
  const [ck, setCk] = useState({
    nama: '',
    wa: '',
    alamat: ''
  });
  // account / auth / payment / orders
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(null); // null | 'login' | 'signup'
  const [af, setAf] = useState({
    nama: '',
    wa: '',
    password: ''
  });
  const [acctOpen, setAcctOpen] = useState(false);
  const [detail, setDetail] = useState(null); // order object for status view
  const [pay, setPay] = useState('cod');
  const [orders, setOrders] = useState(ORDERS0);
  const setQty = (id, q) => setCart(c => {
    const n = {
      ...c
    };
    if (q <= 0) delete n[id];else n[id] = q;
    return n;
  });
  const shown = useMemo(() => PRODUCTS.filter(p => (cat === 'Semua' || p.kategori === cat) && (p.nama.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))), [search, cat]);
  const items = Object.entries(cart).map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return null;
    const harga = priceForQty(p, qty);
    return {
      p,
      qty,
      harga,
      subtotal: harga * qty,
      saving: (p.het - harga) * qty
    };
  }).filter(Boolean);
  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const totalSaving = items.reduce((s, i) => s + i.saving, 0);
  const catLabel = (CATS.find(c => c.v === cat) || CATS[0]).name;
  function openCheckout() {
    if (user) setCk({
      nama: user.nama,
      wa: user.wa,
      alamat: ck.alamat
    });
    setSheet('checkout');
  }
  function doAuth(e) {
    e.preventDefault();
    const nama = auth === 'signup' ? af.nama || 'Konsumen' : af.nama || 'Budi Santoso';
    setUser({
      nama,
      wa: af.wa || '0812 0000 0000'
    });
    setAuth(null);
    setAf({
      nama: '',
      wa: '',
      password: ''
    });
  }
  function placeOrder() {
    const no = 'ORD-00' + (240 + Math.floor(Math.random() * 9));
    const order = {
      no,
      tgl: '28 Jun 2026',
      total,
      status: 'dikonfirmasi',
      bayar: payName(pay),
      items: count,
      payId: pay
    };
    setOrders(o => [order, ...o]);
    setSheet('done');
    setLastNo(order);
  }
  const [lastOrder, setLastNo] = useState(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "cat"
  }, /*#__PURE__*/React.createElement("header", {
    className: "cat__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brontolano-mark.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "cat__brandtext"
  }, /*#__PURE__*/React.createElement("strong", null, "Brontolano"), /*#__PURE__*/React.createElement("span", {
    className: "cat__brandsub"
  }, "Grosir Sembako"))), /*#__PURE__*/React.createElement("div", {
    className: "cat__headright"
  }, user ? /*#__PURE__*/React.createElement("button", {
    className: "cat__avatarbtn",
    onClick: () => setAcctOpen(true),
    "aria-label": "Akun"
  }, initials(user.nama)) : /*#__PURE__*/React.createElement("button", {
    className: "cat__masuk",
    onClick: () => setAuth('login')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user"
  }), " Masuk"), /*#__PURE__*/React.createElement("button", {
    className: "cat__installic",
    "aria-label": "Pasang App"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "cat__trust"
  }, TRUST.map(x => /*#__PURE__*/React.createElement("span", {
    className: "cat__trustitem",
    key: x.t
  }, /*#__PURE__*/React.createElement(Icon, {
    name: x.ic
  }), " ", x.t))), /*#__PURE__*/React.createElement("div", {
    className: "cat__scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__banner-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cat__banner-eyebrow"
  }, "Promo Grosir"), /*#__PURE__*/React.createElement("span", {
    className: "cat__banner-badge"
  }, "Hemat hingga 5%")), /*#__PURE__*/React.createElement("div", {
    className: "cat__banner-h"
  }, "Belanja Grosir,", /*#__PURE__*/React.createElement("br", null), "Untung Lebih Banyak"), /*#__PURE__*/React.createElement("div", {
    className: "cat__banner-sub"
  }, "Makin banyak karton, makin turun harganya \u2014 otomatis."), /*#__PURE__*/React.createElement("div", {
    className: "cat__ladder"
  }, [['HET', '1–5'], ['S1', '6–9'], ['S2', '10–24'], ['S3', '25–150'], ['S4', '>150']].map(([k, r], idx) => /*#__PURE__*/React.createElement("div", {
    className: 'cat__rung' + (idx === 4 ? ' is-best' : ''),
    key: k
  }, /*#__PURE__*/React.createElement("span", {
    className: "cat__rung-k"
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "cat__rung-r"
  }, r)))), /*#__PURE__*/React.createElement("div", {
    className: "cat__ladder-cap"
  }, "Per karton (krtn) \u2014 makin banyak, makin murah \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "cat__searchbar"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    className: "cat__searchic"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Cari produk atau SKU\u2026",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "cat__filterbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: 'cat__catbtn' + (catOpen ? ' is-open' : ''),
    onClick: () => setCatOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layout-grid"
  }), /*#__PURE__*/React.createElement("span", null, catLabel), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    className: "cat__catcaret"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cat__count"
  }, shown.length, " produk")), /*#__PURE__*/React.createElement("div", {
    className: "cat__grid"
  }, shown.map(p => {
    const qty = cart[p.id] || 0;
    const qd = Math.max(qty, 1);
    const harga = priceForQty(p, qd);
    const saving = p.het - harga;
    return /*#__PURE__*/React.createElement(ProductCard, {
      key: p.id,
      name: p.nama,
      sku: p.sku,
      category: p.kategori,
      price: harga,
      wasPrice: saving > 0 ? p.het : null,
      saving: saving > 0 ? saving : 0,
      perPcs: Math.round(harga / p.isi),
      isi: p.isi,
      qty: qty,
      onQty: q => setQty(p.id, q)
    });
  }), shown.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "cat__empty"
  }, "Tidak ada produk ditemukan."))), count > 0 && sheet === null && !catOpen && !auth && !acctOpen && !detail && /*#__PURE__*/React.createElement("div", {
    className: "cat__barwrap"
  }, /*#__PURE__*/React.createElement(CartBar, {
    count: count,
    total: total,
    onClick: () => setSheet('cart')
  })), catOpen && /*#__PURE__*/React.createElement("div", {
    className: "cat__overlay",
    onClick: () => setCatOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-head"
  }, /*#__PURE__*/React.createElement("strong", null, "Pilih Kategori"), /*#__PURE__*/React.createElement("button", {
    className: "cat__x",
    onClick: () => setCatOpen(false),
    "aria-label": "Tutup"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-body cat__catlist"
  }, CATS.map(c => {
    const n = c.v === 'Semua' ? PRODUCTS.length : PRODUCTS.filter(p => p.kategori === c.v).length;
    return /*#__PURE__*/React.createElement("button", {
      key: c.v,
      className: 'cat__catitem' + (cat === c.v ? ' is-sel' : ''),
      onClick: () => {
        setCat(c.v);
        setCatOpen(false);
      }
    }, /*#__PURE__*/React.createElement("span", null, c.name), /*#__PURE__*/React.createElement("span", {
      className: "cat__catn"
    }, n), cat === c.v && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      className: "cat__catcheck"
    }));
  })))), sheet === 'cart' && /*#__PURE__*/React.createElement("div", {
    className: "cat__overlay",
    onClick: () => setSheet(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-head"
  }, /*#__PURE__*/React.createElement("strong", null, "Keranjang (", count, ")"), /*#__PURE__*/React.createElement("button", {
    className: "cat__x",
    onClick: () => setSheet(null),
    "aria-label": "Tutup"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-body"
  }, items.map(i => /*#__PURE__*/React.createElement("div", {
    className: "cat__cartrow",
    key: i.p.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__cartinfo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__cartname"
  }, i.p.nama), /*#__PURE__*/React.createElement("div", {
    className: "cat__carttier"
  }, rupiah(i.harga), " /karton \xB7 Tier ", tierForQty(i.qty))), /*#__PURE__*/React.createElement(QtyStepper, {
    value: i.qty,
    onChange: q => setQty(i.p.id, q),
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cat__cartsub"
  }, rupiah(i.subtotal))))), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-foot"
  }, totalSaving > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cat__saverow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "badge-percent"
  }), " Anda hemat ", rupiah(totalSaving), " dengan harga grosir"), /*#__PURE__*/React.createElement("div", {
    className: "cat__totalrow"
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("strong", null, rupiah(total))), /*#__PURE__*/React.createElement(Button, {
    variant: "commerce",
    size: "lg",
    block: true,
    onClick: openCheckout
  }, "Lanjut ke Pembayaran")))), sheet === 'checkout' && /*#__PURE__*/React.createElement("div", {
    className: "cat__overlay",
    onClick: () => setSheet('cart')
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet cat__sheet--tall",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-head"
  }, /*#__PURE__*/React.createElement("strong", null, "Checkout"), /*#__PURE__*/React.createElement("button", {
    className: "cat__x",
    onClick: () => setSheet('cart'),
    "aria-label": "Tutup"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-body"
  }, !user && /*#__PURE__*/React.createElement("button", {
    className: "cat__loginbar",
    onClick: () => setAuth('login')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user-round"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Masuk"), " untuk simpan alamat & lacak pesanan"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cat__formsec"
  }, "Data Pemesan"), /*#__PURE__*/React.createElement(Input, {
    label: "Nama",
    required: true,
    value: ck.nama,
    onChange: e => setCk({
      ...ck,
      nama: e.target.value
    }),
    placeholder: "Nama Anda"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Nomor WhatsApp",
    required: true,
    prefix: "+62",
    value: ck.wa,
    onChange: e => setCk({
      ...ck,
      wa: e.target.value
    }),
    placeholder: "81234 5678"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Alamat Pengiriman",
    value: ck.alamat,
    onChange: e => setCk({
      ...ck,
      alamat: e.target.value
    }),
    placeholder: "Jl. / Toko / patokan"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cat__formsec"
  }, "Metode Pembayaran"), /*#__PURE__*/React.createElement("div", {
    className: "cat__paylist"
  }, PAYMENTS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    disabled: !p.enabled,
    className: 'cat__payopt' + (pay === p.id ? ' is-sel' : '') + (!p.enabled ? ' is-off' : ''),
    onClick: () => p.enabled && setPay(p.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cat__payic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: p.icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "cat__payinfo"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cat__payname"
  }, p.name, p.primary && /*#__PURE__*/React.createElement("span", {
    className: "cat__paybadge"
  }, "Utama"), !p.enabled && /*#__PURE__*/React.createElement("span", {
    className: "cat__payoff"
  }, "Nonaktif")), /*#__PURE__*/React.createElement("span", {
    className: "cat__paydesc"
  }, p.desc)), /*#__PURE__*/React.createElement("span", {
    className: "cat__payradio"
  }, pay === p.id && /*#__PURE__*/React.createElement("span", {
    className: "cat__paydot"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "cat__paynote"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings"
  }), " Metode pembayaran diatur oleh admin di panel.")), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__totalrow"
  }, /*#__PURE__*/React.createElement("span", null, "Total (", count, " item)"), /*#__PURE__*/React.createElement("strong", null, rupiah(total))), /*#__PURE__*/React.createElement(Button, {
    variant: "commerce",
    size: "lg",
    block: true,
    disabled: !ck.nama || !ck.wa,
    onClick: placeOrder
  }, "Buat Pesanan")))), sheet === 'done' && lastOrder && /*#__PURE__*/React.createElement("div", {
    className: "cat__overlay",
    onClick: () => {
      setSheet(null);
      setCart({});
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__done",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__done-ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check"
  })), /*#__PURE__*/React.createElement("h3", null, "Pesanan dibuat!"), /*#__PURE__*/React.createElement("p", {
    className: "cat__doneno"
  }, lastOrder.no, " \xB7 ", rupiah(lastOrder.total)), /*#__PURE__*/React.createElement("p", null, lastOrder.payId === 'cod' ? 'Bayar tunai saat barang tiba. Admin akan konfirmasi stok & ongkir via WhatsApp.' : `Selesaikan pembayaran ${lastOrder.bayar} — instruksi dikirim via WhatsApp.`), /*#__PURE__*/React.createElement(Button, {
    variant: "commerce",
    block: true,
    onClick: () => {
      setCart({});
      setSheet(null);
      setDetail(lastOrder);
    }
  }, "Lihat Status Pesanan"), /*#__PURE__*/React.createElement("button", {
    className: "cat__textbtn",
    onClick: () => {
      setSheet(null);
      setCart({});
    }
  }, "Belanja Lagi"))), auth && /*#__PURE__*/React.createElement("div", {
    className: "cat__overlay",
    onClick: () => setAuth(null)
  }, /*#__PURE__*/React.createElement("form", {
    className: "cat__sheet",
    onClick: e => e.stopPropagation(),
    onSubmit: doAuth
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-head"
  }, /*#__PURE__*/React.createElement("strong", null, auth === 'login' ? 'Masuk' : 'Daftar Akun'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cat__x",
    onClick: () => setAuth(null),
    "aria-label": "Tutup"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__authlede"
  }, auth === 'login' ? 'Masuk dengan nomor WhatsApp aktif Anda.' : 'Daftar pakai nomor WhatsApp aktif — untuk lacak pesanan & checkout cepat.'), auth === 'signup' && /*#__PURE__*/React.createElement(Input, {
    label: "Nama Lengkap",
    required: true,
    value: af.nama,
    onChange: e => setAf({
      ...af,
      nama: e.target.value
    }),
    placeholder: "Nama Anda"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Nomor WhatsApp",
    required: true,
    prefix: "+62",
    value: af.wa,
    onChange: e => setAf({
      ...af,
      wa: e.target.value
    }),
    placeholder: "81234 5678"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    required: true,
    type: "password",
    value: af.password,
    onChange: e => setAf({
      ...af,
      password: e.target.value
    }),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  }), auth === 'login' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cat__textbtn cat__textbtn--right"
  }, "Lupa password?")), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-foot"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    type: "submit"
  }, auth === 'login' ? 'Masuk' : 'Daftar'), /*#__PURE__*/React.createElement("div", {
    className: "cat__authswitch"
  }, auth === 'login' ? /*#__PURE__*/React.createElement("span", null, "Belum punya akun? ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAuth('signup')
  }, "Daftar")) : /*#__PURE__*/React.createElement("span", null, "Sudah punya akun? ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAuth('login')
  }, "Masuk")))))), acctOpen && user && /*#__PURE__*/React.createElement("div", {
    className: "cat__overlay",
    onClick: () => setAcctOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet cat__sheet--tall",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-head"
  }, /*#__PURE__*/React.createElement("strong", null, "Akun Saya"), /*#__PURE__*/React.createElement("button", {
    className: "cat__x",
    onClick: () => setAcctOpen(false),
    "aria-label": "Tutup"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__profile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__pavatar"
  }, initials(user.nama)), /*#__PURE__*/React.createElement("div", {
    className: "cat__pinfo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__pname"
  }, user.nama), /*#__PURE__*/React.createElement("div", {
    className: "cat__pwa"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " +62 ", user.wa))), /*#__PURE__*/React.createElement("div", {
    className: "cat__formsec"
  }, "Riwayat Pesanan"), /*#__PURE__*/React.createElement("div", {
    className: "cat__orderlist"
  }, orders.map(o => /*#__PURE__*/React.createElement("button", {
    className: "cat__orderrow",
    key: o.no,
    onClick: () => {
      setAcctOpen(false);
      setDetail(o);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cat__orderinfo"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cat__orderno"
  }, o.no), /*#__PURE__*/React.createElement("span", {
    className: "cat__ordermeta"
  }, o.tgl, " \xB7 ", o.items, " item \xB7 ", o.bayar.split('—')[0].trim())), /*#__PURE__*/React.createElement("span", {
    className: "cat__orderright"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cat__ordertotal"
  }, rupiah(o.total)), /*#__PURE__*/React.createElement(StatusBadgeFor, {
    status: o.status
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "cat__logout",
    onClick: () => {
      setUser(null);
      setAcctOpen(false);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out"
  }), " Keluar")))), detail && /*#__PURE__*/React.createElement("div", {
    className: "cat__overlay",
    onClick: () => setDetail(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet cat__sheet--tall",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-head"
  }, /*#__PURE__*/React.createElement("strong", null, "Status Pesanan"), /*#__PURE__*/React.createElement("button", {
    className: "cat__x",
    onClick: () => setDetail(null),
    "aria-label": "Tutup"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__detailtop"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cat__orderno"
  }, detail.no), /*#__PURE__*/React.createElement("div", {
    className: "cat__ordermeta"
  }, detail.tgl)), /*#__PURE__*/React.createElement(StatusBadgeFor, {
    status: detail.status
  })), /*#__PURE__*/React.createElement("div", {
    className: "cat__timeline"
  }, FLOW.map((f, i) => {
    const cur = stepOf(detail.status);
    const state = i < cur ? 'done' : i === cur ? 'active' : 'todo';
    return /*#__PURE__*/React.createElement("div", {
      className: 'cat__tstep is-' + state,
      key: f.k
    }, /*#__PURE__*/React.createElement("span", {
      className: "cat__tdot"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: i <= cur ? 'check' : f.ic
    })), /*#__PURE__*/React.createElement("span", {
      className: "cat__tlabel"
    }, f.label));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cat__detailcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat__drow"
  }, /*#__PURE__*/React.createElement("span", null, "Metode bayar"), /*#__PURE__*/React.createElement("strong", null, detail.bayar)), /*#__PURE__*/React.createElement("div", {
    className: "cat__drow"
  }, /*#__PURE__*/React.createElement("span", null, "Jumlah item"), /*#__PURE__*/React.createElement("strong", null, detail.items, " item")), /*#__PURE__*/React.createElement("div", {
    className: "cat__drow cat__drow--total"
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("strong", null, rupiah(detail.total))))), /*#__PURE__*/React.createElement("div", {
    className: "cat__sheet-foot"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "whatsapp",
    size: "lg",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle"
    })
  }, "Hubungi Admin")))));
}
window.Catalog = Catalog;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/katalog/Catalog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/staff-pwa/Staff.jsx
try { (() => {
// Staff PWA — field (lapangan) + warehouse (gudang) tools, redesigned around
// researched field-app patterns: bottom tab nav in the thumb zone, a task-
// focused home dashboard with progress visibility, big high-contrast targets,
// actions in context. Exports <Staff> to window.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

// Robust Lucide-in-React icon.
function Icon({
  name,
  className
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    try {
      window.lucide.createIcons();
    } catch (e) {}
  }, [name]);
  return React.createElement('span', {
    ref,
    className: 'ic' + (className ? ' ' + className : ''),
    'aria-hidden': true
  });
}
function priceForQty(b, qty) {
  if (qty >= 25) return b.s3;
  if (qty >= 10) return b.s2;
  if (qty >= 6) return b.s1;
  return b.het;
}
function tierForQty(qty) {
  if (qty >= 25) return 'S3';
  if (qty >= 10) return 'S2';
  if (qty >= 6) return 'S1';
  return 'HET';
}
const rupiah = n => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
const rIngkas = n => n >= 1000000 ? 'Rp ' + (n / 1000000).toFixed(1).replace('.0', '') + ' jt' : rupiah(n);
const KONSUMEN = ['Toko Berkah Jaya', 'Warung Bu Sri', 'Grosir Makmur', 'Kios Pak Joko'];
const BARANG = [{
  id: 'b1',
  nama: 'Indomie Goreng Spesial',
  stok: 84,
  het: 116000,
  s1: 114000,
  s2: 112000,
  s3: 111000
}, {
  id: 'b2',
  nama: 'MinyaKita 1L',
  stok: 12,
  het: 188000,
  s1: 187000,
  s2: 186000,
  s3: 185000
}, {
  id: 'b3',
  nama: 'Gula Pasir Gulaku 1kg',
  stok: 56,
  het: 174000,
  s1: 172000,
  s2: 170000,
  s3: 169000
}, {
  id: 'b4',
  nama: 'Teh Pucuk Harum 350ml',
  stok: 132,
  het: 49000,
  s1: 48000,
  s2: 47000,
  s3: 46500
}];
const TASKS = [{
  toko: 'Toko Berkah Jaya',
  alamat: 'Jl. Mayor Abdurahman',
  jenis: 'Kirim',
  status: 'selesai'
}, {
  toko: 'Warung Bu Sri',
  alamat: 'Jl. Prabu Geusan Ulun',
  jenis: 'Kirim',
  status: 'proses'
}, {
  toko: 'Grosir Makmur',
  alamat: 'Jl. Pangeran Kornel',
  jenis: 'Kunjungi',
  status: 'menunggu'
}, {
  toko: 'Kios Pak Joko',
  alamat: 'Jl. Tampomas No. 14',
  jenis: 'Kirim',
  status: 'menunggu'
}];
const STOK_RENDAH = [{
  nama: 'MinyaKita 1L',
  stok: 12,
  min: 24
}, {
  nama: 'Beras Pandan Wangi 5kg',
  stok: 8,
  min: 10
}];
const TABS = [{
  k: 'beranda',
  icon: 'home',
  label: 'Beranda'
}, {
  k: 'rute',
  icon: 'truck',
  label: 'Rute'
}, {
  k: 'pos',
  icon: 'shopping-cart',
  label: 'Order'
}, {
  k: 'stok',
  icon: 'package',
  label: 'Stok'
}, {
  k: 'akun',
  icon: 'user',
  label: 'Akun'
}];
function StatusPill({
  status
}) {
  const {
    StatusBadge
  } = NS;
  if (status === 'selesai') return /*#__PURE__*/React.createElement(StatusBadge, {
    status: "selesai"
  }, "selesai");
  if (status === 'proses') return /*#__PURE__*/React.createElement(StatusBadge, {
    status: "dikirim"
  }, "proses");
  return /*#__PURE__*/React.createElement(StatusBadge, {
    status: "draft"
  }, "menunggu");
}
function Staff() {
  const {
    Select,
    Button,
    QtyStepper
  } = NS;
  const {
    useState
  } = React;
  const [tab, setTab] = useState('beranda');
  const [konsumen, setKonsumen] = useState('');
  const [cart, setCart] = useState({});
  const [done, setDone] = useState(null);
  const setQty = (id, q) => setCart(c => {
    const n = {
      ...c
    };
    if (q <= 0) delete n[id];else n[id] = q;
    return n;
  });
  const items = Object.entries(cart).map(([id, qty]) => {
    const b = BARANG.find(x => x.id === id);
    return {
      b,
      qty,
      harga: priceForQty(b, qty)
    };
  });
  const total = items.reduce((s, i) => s + i.harga * i.qty, 0);
  function submit() {
    if (!konsumen || items.length === 0) return;
    const no = 'ORD-00' + (232 + Math.floor(Math.random() * 9));
    setDone({
      no,
      total,
      konsumen
    });
    setCart({});
    setKonsumen('');
  }
  const target = 5000000,
    tercapai = 3200000;
  const pct = Math.round(tercapai / target * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "stf"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__screen"
  }, tab === 'beranda' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "stf__hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__herotop"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "stf__hello"
  }, "Halo, Budi"), /*#__PURE__*/React.createElement("div", {
    className: "stf__sub"
  }, "Staff Lapangan \xB7 Sumedang")), /*#__PURE__*/React.createElement("span", {
    className: "stf__sync"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__dot"
  }), " Tersinkron")), /*#__PURE__*/React.createElement("div", {
    className: "stf__progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__progresshead"
  }, /*#__PURE__*/React.createElement("span", null, "Target Omset Hari Ini"), /*#__PURE__*/React.createElement("strong", null, pct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "stf__bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__barfill",
    style: {
      width: pct + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "stf__progressval"
  }, rupiah(tercapai), " ", /*#__PURE__*/React.createElement("span", null, "dari ", rIngkas(target))))), /*#__PURE__*/React.createElement("div", {
    className: "stf__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__mini"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__minicard"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "receipt"
  }), /*#__PURE__*/React.createElement("strong", null, "7"), /*#__PURE__*/React.createElement("span", null, "Order")), /*#__PURE__*/React.createElement("div", {
    className: "stf__minicard"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "store"
  }), /*#__PURE__*/React.createElement("strong", null, "8"), /*#__PURE__*/React.createElement("span", null, "Toko")), /*#__PURE__*/React.createElement("div", {
    className: "stf__minicard"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wallet"
  }), /*#__PURE__*/React.createElement("strong", null, "1,2jt"), /*#__PURE__*/React.createElement("span", null, "Setoran"))), /*#__PURE__*/React.createElement("div", {
    className: "stf__quick"
  }, /*#__PURE__*/React.createElement("button", {
    className: "stf__qbtn",
    onClick: () => setTab('pos')
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__qic stf__qic--red"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  })), "Order Baru"), /*#__PURE__*/React.createElement("button", {
    className: "stf__qbtn"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__qic stf__qic--green"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user-plus"
  })), "Konsumen"), /*#__PURE__*/React.createElement("button", {
    className: "stf__qbtn"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__qic stf__qic--blue"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "banknote"
  })), "Setor")), /*#__PURE__*/React.createElement("div", {
    className: "stf__sectionhead"
  }, /*#__PURE__*/React.createElement("strong", null, "Tugas Hari Ini"), /*#__PURE__*/React.createElement("button", {
    className: "stf__link",
    onClick: () => setTab('rute')
  }, "Lihat semua")), /*#__PURE__*/React.createElement("div", {
    className: "stf__tasks"
  }, TASKS.slice(0, 3).map(t => /*#__PURE__*/React.createElement("button", {
    className: "stf__task",
    key: t.toko
  }, /*#__PURE__*/React.createElement("span", {
    className: 'stf__taskic stf__taskic--' + t.status
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.jenis === 'Kirim' ? 'truck' : 'map-pin'
  })), /*#__PURE__*/React.createElement("span", {
    className: "stf__taskinfo"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__taskname"
  }, t.toko), /*#__PURE__*/React.createElement("span", {
    className: "stf__taskaddr"
  }, t.jenis, " \xB7 ", t.alamat)), /*#__PURE__*/React.createElement(StatusPill, {
    status: t.status
  })))))), tab === 'rute' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "stf__head"
  }, /*#__PURE__*/React.createElement("strong", null, "Rute Kirim"), /*#__PURE__*/React.createElement("span", {
    className: "stf__headsub"
  }, "Hari ini \xB7 4 toko")), /*#__PURE__*/React.createElement("div", {
    className: "stf__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__routebar"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map"
  }), " 1 selesai \xB7 1 proses \xB7 2 menunggu ", /*#__PURE__*/React.createElement("button", {
    className: "stf__maps"
  }, "Buka Maps")), TASKS.map((t, i) => /*#__PURE__*/React.createElement("div", {
    className: "stf__stop",
    key: t.toko
  }, /*#__PURE__*/React.createElement("span", {
    className: 'stf__stopnum stf__stopnum--' + t.status
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "stf__stopinfo"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__taskname"
  }, t.toko), /*#__PURE__*/React.createElement("span", {
    className: "stf__taskaddr"
  }, t.alamat)), /*#__PURE__*/React.createElement("span", {
    className: "stf__stopright"
  }, /*#__PURE__*/React.createElement(StatusPill, {
    status: t.status
  }), t.status !== 'selesai' && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: t.status === 'proses' ? 'primary' : 'secondary'
  }, t.status === 'proses' ? 'Selesai' : 'Mulai')))))), tab === 'pos' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "stf__head"
  }, /*#__PURE__*/React.createElement("strong", null, "Order Baru"), /*#__PURE__*/React.createElement("span", {
    className: "stf__headsub"
  }, "POS Lapangan")), /*#__PURE__*/React.createElement("div", {
    className: "stf__body stf__body--pos"
  }, done && /*#__PURE__*/React.createElement("div", {
    className: "stf__done"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "stf__doneline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle"
  }), " ", done.no), " \u2014 ", rupiah(done.total), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "stf__muted"
  }, "Invoice otomatis dibuat \xB7 ", done.konsumen), /*#__PURE__*/React.createElement("div", {
    className: "stf__donebtns"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "printer"
    }),
    onClick: () => {}
  }, "Cetak Struk"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setDone(null)
  }, "Order Baru"))), /*#__PURE__*/React.createElement("div", {
    className: "stf__panel"
  }, /*#__PURE__*/React.createElement("label", {
    className: "stf__label"
  }, "Konsumen"), /*#__PURE__*/React.createElement(Select, {
    placeholder: "\u2014 pilih konsumen \u2014",
    options: KONSUMEN,
    value: konsumen,
    onChange: e => setKonsumen(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    className: "stf__label",
    style: {
      marginTop: 12
    }
  }, "Barang"), /*#__PURE__*/React.createElement("div", {
    className: "stf__barang"
  }, BARANG.map(b => {
    const qty = cart[b.id] || 0;
    const harga = priceForQty(b, Math.max(qty, 1));
    return /*#__PURE__*/React.createElement("div", {
      className: "stf__row",
      key: b.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "stf__rowinfo"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stf__rowname"
    }, b.nama), /*#__PURE__*/React.createElement("div", {
      className: "stf__rowmeta"
    }, rupiah(harga), " ", qty > 0 ? `· Tier ${tierForQty(qty)}` : '', " \xB7 stok ", b.stok)), qty === 0 ? /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      onClick: () => setQty(b.id, 1)
    }, "+") : /*#__PURE__*/React.createElement(QtyStepper, {
      value: qty,
      onChange: q => setQty(b.id, q),
      size: "sm"
    }));
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: submit,
    disabled: !items.length || !konsumen
  }, items.length ? `Buat Order · ${rupiah(total)}` : 'Buat Order'))), tab === 'stok' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "stf__head"
  }, /*#__PURE__*/React.createElement("strong", null, "Stok Gudang"), /*#__PURE__*/React.createElement("span", {
    className: "stf__headsub"
  }, "214 barang")), /*#__PURE__*/React.createElement("div", {
    className: "stf__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__quick stf__quick--2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "stf__qbtn"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__qic stf__qic--green"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-down-to-line"
  })), "Stok Masuk"), /*#__PURE__*/React.createElement("button", {
    className: "stf__qbtn"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__qic stf__qic--red"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-from-line"
  })), "Stok Keluar")), /*#__PURE__*/React.createElement("div", {
    className: "stf__sectionhead"
  }, /*#__PURE__*/React.createElement("strong", null, "Perlu Restok"), /*#__PURE__*/React.createElement("span", {
    className: "stf__warnpill"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle"
  }), " ", STOK_RENDAH.length)), STOK_RENDAH.map(s => /*#__PURE__*/React.createElement("div", {
    className: "stf__stokrow",
    key: s.nama
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__stokinfo"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stf__taskname"
  }, s.nama), /*#__PURE__*/React.createElement("span", {
    className: "stf__taskaddr"
  }, "Min. ", s.min)), /*#__PURE__*/React.createElement("span", {
    className: "stf__stoknum"
  }, s.stok, /*#__PURE__*/React.createElement("span", null, " krtn")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary"
  }, "+ Masuk"))))), tab === 'akun' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "stf__head"
  }, /*#__PURE__*/React.createElement("strong", null, "Akun")), /*#__PURE__*/React.createElement("div", {
    className: "stf__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__profile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stf__avatar"
  }, "BS"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "stf__taskname"
  }, "Budi Santoso"), /*#__PURE__*/React.createElement("div", {
    className: "stf__taskaddr"
  }, "Staff Lapangan \xB7 Sumedang"))), /*#__PURE__*/React.createElement("div", {
    className: "stf__synccard"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh-cw"
  }), " ", /*#__PURE__*/React.createElement("span", null, "Tersinkron \xB7 2 menit lalu"), /*#__PURE__*/React.createElement("span", {
    className: "stf__online"
  }, "\u25CF Online")), /*#__PURE__*/React.createElement("div", {
    className: "stf__menu"
  }, [['settings', 'Pengaturan'], ['bell', 'Notifikasi'], ['life-buoy', 'Bantuan'], ['info', 'Tentang Aplikasi']].map(([ic, l]) => /*#__PURE__*/React.createElement("button", {
    className: "stf__menuitem",
    key: l
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic
  }), /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    className: "stf__menuchev"
  })))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "log-out"
    })
  }, "Keluar")))), /*#__PURE__*/React.createElement("nav", {
    className: "stf__nav"
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.k,
    className: 'stf__navitem' + (tab === t.k ? ' is-active' : ''),
    onClick: () => setTab(t.k)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon
  }), /*#__PURE__*/React.createElement("span", null, t.label)))));
}
window.Staff = Staff;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/staff-pwa/Staff.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CartBar = __ds_scope.CartBar;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.QtyStepper = __ds_scope.QtyStepper;

__ds_ns.Price = __ds_scope.Price;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.TierBadge = __ds_scope.TierBadge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Toast = __ds_scope.Toast;

})();
