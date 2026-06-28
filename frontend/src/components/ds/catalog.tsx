import React from 'react';
import { rupiah } from './data';

export interface QtyStepperProps {
  value?: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  block?: boolean;
  className?: string;
}

/** −/value/+ quantity control — catalog cards, POS rows, cart sheet. */
export function QtyStepper({ value = 0, onChange, min = 0, max = Infinity, size = 'md', block = false, className = '' }: QtyStepperProps) {
  const set = (v: number) => { if (onChange) onChange(Math.max(min, Math.min(max, v))); };
  const cls = ['ds-stepper', `ds-stepper--${size}`, block ? 'ds-stepper--block' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <button type="button" className="ds-stepper__btn" aria-label="Kurangi" onClick={() => set(value - 1)} disabled={value <= min}>−</button>
      <input className="ds-stepper__input" inputMode="numeric" value={value} aria-label="Jumlah" onChange={(e) => set(parseInt(e.target.value, 10) || 0)} />
      <button type="button" className="ds-stepper__btn" aria-label="Tambah" onClick={() => set(value + 1)} disabled={value >= max}>+</button>
    </div>
  );
}

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  sku?: string;
  size?: string;
  category?: string;
  image?: string | null;
  price: number;
  perPcs?: number | null;
  isi?: number | null;
  hotTier?: string | null;
  wasPrice?: number | null;
  saving?: number;
  lowestPrice?: number | null; // harga termurah (tier S4) untuk anchor "terkesan murah"
  qty?: number;
  onQty?: (v: number) => void;
}

/** Public-catalog product card — image, tiered price, add/stepper. */
export function ProductCard({
  name, sku = '', size = '', category = '', image = null,
  price, perPcs = null, isi = null, hotTier = null,
  wasPrice = null, saving = 0, lowestPrice = null, qty = 0, onQty, className = '', ...rest
}: ProductCardProps) {
  return (
    <div className={['ds-product', className].filter(Boolean).join(' ')} {...rest}>
      <div className="ds-product__img">
        {image ? <img src={image} alt={name} loading="lazy" /> : <span className="ds-product__ph" aria-hidden="true">📦</span>}
        {category && <span className="ds-product__cat">{category}</span>}
        {hotTier && <span className="ds-product__hot">Tier {hotTier} 🔥</span>}
        {lowestPrice != null && lowestPrice < price && (
          <span className="ds-product__floortag"><small>SEMURAH</small>{rupiah(lowestPrice)}<i>/krtn</i></span>
        )}
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

export interface CartBarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
  total?: number;
  label?: string;
  fixed?: boolean;
}

/** Floating green cart bar — appears when the catalog cart has items. */
export function CartBar({ count = 0, total = 0, label = 'Lihat Keranjang →', fixed = false, className = '', ...rest }: CartBarProps) {
  return (
    <button className={['ds-cartbar', fixed ? 'ds-cartbar--fixed' : '', className].filter(Boolean).join(' ')} {...rest}>
      <span className="ds-cartbar__count"><span aria-hidden="true">🛒</span> {count} item</span>
      <span className="ds-cartbar__total">{rupiah(total)}</span>
      <span className="ds-cartbar__cta">{label}</span>
    </button>
  );
}
