import React from 'react';

function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
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

const ICON = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

/** A single toast notification (bottom-right of the back-office). */
export function Toast({ type = 'info', children, icon, className = '', ...rest }) {
  return (
    <div className={['ds-toast', `ds-toast--${type}`, className].filter(Boolean).join(' ')} role="status" {...rest}>
      <span className="ds-toast__icon" aria-hidden="true">{icon != null ? icon : ICON[type]}</span>
      <span>{children}</span>
    </div>
  );
}
