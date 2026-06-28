import React from 'react';
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
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
export function rupiah(n) {
  const v = Number(n) || 0;
  return 'Rp ' + v.toLocaleString('id-ID');
}

/** Rupiah price display with optional unit and per-pcs breakdown. */
export function Price({ amount, unit = 'karton', perPcs = null, isi = null, size = 'md', className = '', ...rest }) {
  return (
    <div className={['ds-price', `ds-price--${size}`, className].filter(Boolean).join(' ')} {...rest}>
      <span className="ds-price__main">{rupiah(amount)}</span>
      {unit && <span className="ds-price__unit"> /{unit}</span>}
      {perPcs != null && (
        <span className="ds-price__pcs">≈ {rupiah(perPcs)} /pcs{isi ? ` · isi ${isi}` : ''}</span>
      )}
    </div>
  );
}
