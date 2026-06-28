import React from 'react';
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
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
export function IconButton({
  size = 'md',
  outline = false,
  label,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'ds-iconbtn',
    `ds-iconbtn--${size}`,
    outline ? 'ds-iconbtn--outline' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-label={label} {...rest}>
      {children}
    </button>
  );
}
