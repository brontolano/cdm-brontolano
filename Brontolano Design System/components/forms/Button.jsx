import React from 'react';
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
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
export function Button({
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
  const cls = [
    'ds-btn',
    `ds-btn--${variant}`,
    `ds-btn--${size}`,
    block ? 'ds-btn--block' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {iconLeft}
      {children != null && <span>{children}</span>}
      {iconRight}
    </button>
  );
}
