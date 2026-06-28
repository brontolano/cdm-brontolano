import React from 'react';
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
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
  draft:       ['--badge-draft-bg', '--badge-draft-fg'],
  confirmed:   ['--badge-confirmed-bg', '--badge-confirmed-fg'],
  proses:      ['--badge-proses-bg', '--badge-proses-fg'],
  dikirim:     ['--badge-dikirim-bg', '--badge-dikirim-fg'],
  selesai:     ['--badge-selesai-bg', '--badge-selesai-fg'],
  dibatalkan:  ['--badge-batal-bg', '--badge-batal-fg'],
  lunas:       ['--badge-lunas-bg', '--badge-lunas-fg'],
  sebagian:    ['--badge-sebagian-bg', '--badge-sebagian-fg'],
  belum:       ['--badge-belum-bg', '--badge-belum-fg'],
  aktif:       ['--badge-aktif-bg', '--badge-aktif-fg'],
  tidak_aktif: ['--badge-nonaktif-bg', '--badge-nonaktif-fg'],
};

/** Domain status pill — colors itself from the status string. */
export function StatusBadge({ status, children, className = '', ...rest }) {
  const key = String(status || '').toLowerCase();
  const [bg, fg] = MAP[key] || MAP.draft;
  const label = children != null ? children : key.replace('_', ' ');
  return (
    <span
      className={['ds-badge', className].filter(Boolean).join(' ')}
      style={{ background: `var(${bg})`, color: `var(${fg})` }}
      {...rest}
    >
      {label}
    </span>
  );
}
