import React from 'react';

function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
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

function rupiah(n) { return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID'); }

/** Floating green cart bar — appears when the catalog cart has items. */
export function CartBar({ count = 0, total = 0, label = 'Lihat Keranjang →', fixed = false, className = '', ...rest }) {
  return (
    <button className={['ds-cartbar', fixed ? 'ds-cartbar--fixed' : '', className].filter(Boolean).join(' ')} {...rest}>
      <span className="ds-cartbar__count"><span aria-hidden="true">🛒</span> {count} item</span>
      <span className="ds-cartbar__total">{rupiah(total)}</span>
      <span className="ds-cartbar__cta">{label}</span>
    </button>
  );
}
