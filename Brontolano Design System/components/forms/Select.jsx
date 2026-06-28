import React from 'react';
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

injectOnce('ds-select', `
.ds-select__wrap { position: relative; display: block; }
.ds-select {
  width: 100%;
  appearance: none;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--text);
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 9px 34px 9px 11px;
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-select:hover { border-color: var(--border-strong); }
.ds-select:focus { outline: none; border-color: var(--brand-400); box-shadow: 0 0 0 3px var(--focus-ring); }
.ds-select:disabled { background: var(--surface-sunken); color: var(--text-muted); cursor: not-allowed; }
.ds-select__caret { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); font-size: 11px; }
`);

/** Native select with the brand chrome (caret, focus ring). */
export function Select({
  options = [],
  placeholder,
  className = '',
  children,
  ...rest
}) {
  return (
    <div className="ds-select__wrap">
      <select className={['ds-select', className].filter(Boolean).join(' ')} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {children}
        {options.map((o) => {
          const value = typeof o === 'string' ? o : o.value;
          const label = typeof o === 'string' ? o : o.label;
          return <option key={value} value={value}>{label}</option>;
        })}
      </select>
      <span className="ds-select__caret">▼</span>
    </div>
  );
}
