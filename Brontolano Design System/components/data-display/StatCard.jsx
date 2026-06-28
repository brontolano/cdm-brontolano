import React from 'react';
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
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
export function StatCard({ label, value, icon = null, delta = null, deltaDir = 'up', accent = false, className = '', ...rest }) {
  const cls = ['ds-stat', accent ? 'ds-stat--accent' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="ds-stat__top">
        <span className="ds-stat__label">{label}</span>
        {icon && <span className="ds-stat__icon" aria-hidden="true">{icon}</span>}
      </div>
      <div className="ds-stat__value">{value}</div>
      {delta != null && (
        <div className={`ds-stat__delta ds-stat__delta--${deltaDir}`}>
          {deltaDir === 'up' ? '▲' : '▼'} {delta}
        </div>
      )}
    </div>
  );
}
