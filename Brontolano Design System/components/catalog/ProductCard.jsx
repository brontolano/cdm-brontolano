import React from 'react';
import { QtyStepper } from './QtyStepper';

function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
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

function rupiah(n) { return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID'); }

/** Public-catalog product card — image, tiered price, add/stepper. */
export function ProductCard({
  name, sku = '', size = '', category = '', image = null,
  price, perPcs = null, isi = null, hotTier = null,
  wasPrice = null, saving = 0,
  qty = 0, onQty, className = '', ...rest
}) {
  return (
    <div className={['ds-product', className].filter(Boolean).join(' ')} {...rest}>
      <div className="ds-product__img">
        {image
          ? <img src={image} alt={name} loading="lazy" />
          : <span className="ds-product__ph" aria-hidden="true">📦</span>}
        {category && <span className="ds-product__cat">{category}</span>}
        {hotTier && <span className="ds-product__hot">Tier {hotTier} 🔥</span>}
      </div>
      <div className="ds-product__body">
        <div className="ds-product__name">{name}</div>
        <div className="ds-product__sku">{sku}{size ? ` · ${size}` : ''}</div>
        <div className="ds-product__price">{rupiah(price)} <span className="u">/karton</span>{wasPrice && wasPrice > price ? <span className="was">{rupiah(wasPrice)}</span> : null}</div>
        {perPcs != null && <div className="ds-product__pcs">≈ {rupiah(perPcs)} /pcs{isi ? ` · isi ${isi}` : ''}</div>}
        {saving > 0 && <div className="ds-product__save">Hemat {rupiah(saving)}/karton</div>}
        {qty === 0
          ? <button className="ds-product__add" onClick={() => onQty && onQty(1)}>+ Keranjang</button>
          : <div style={{ marginTop: 6 }}><QtyStepper value={qty} onChange={onQty} block /></div>}
      </div>
    </div>
  );
}
