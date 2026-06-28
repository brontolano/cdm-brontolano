import React from 'react';
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
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

const RANGES = { HET: '1–5', S1: '6–9', S2: '10–24', S3: '25–150', S4: '>150' };

/** Wholesale tier pill (HET·S1–S4). `hot` = an active discount (brand red). */
export function TierBadge({ tier = 'HET', range = false, hot = false, active = false, className = '', ...rest }) {
  const key = String(tier).toUpperCase();
  const cls = ['ds-tier', hot ? 'ds-tier--hot' : active ? 'ds-tier--active' : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {hot && <span aria-hidden="true">🔥</span>}
      {key}
      {range && <span className="ds-tier__range">{RANGES[key] || ''} krtn</span>}
    </span>
  );
}
