import React from 'react';

function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

injectOnce('ds-card', `
.ds-card {
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
.ds-card--flush { padding: 0; }
.ds-card--accent { border-top: 3px solid var(--brand-500); }
.ds-card--interactive { cursor: pointer; transition: box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
.ds-card--interactive:hover { box-shadow: var(--shadow-md); border-color: var(--border-strong); transform: translateY(-1px); }
.ds-card__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-bottom: var(--space-3); }
.ds-card--flush .ds-card__head { padding: var(--space-4) var(--space-4) 0; margin-bottom: var(--space-3); }
.ds-card__title { font-size: var(--text-lg); font-weight: 700; letter-spacing: var(--tracking-tight); margin: 0; }
`);

/** The white, hairline-bordered container that holds almost everything. */
export function Card({
  title = null,
  actions = null,
  flush = false,
  accent = false,
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'ds-card',
    flush ? 'ds-card--flush' : '',
    accent ? 'ds-card--accent' : '',
    interactive ? 'ds-card--interactive' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {(title || actions) && (
        <div className="ds-card__head">
          {title && <h3 className="ds-card__title">{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
