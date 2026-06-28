import React from 'react';
function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

injectOnce('ds-input', `
.ds-field { margin-bottom: var(--space-3); display: block; }
.ds-field__label { display: block; font-size: var(--text-sm); font-weight: var(--weight-semibold); margin-bottom: var(--space-1); color: var(--text); }
.ds-field__req { color: var(--danger); margin-left: 2px; }
.ds-field__wrap { position: relative; display: flex; align-items: center; }
.ds-field__control {
  width: 100%;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--text);
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 9px 11px;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.ds-field__control::placeholder { color: var(--text-subtle); }
.ds-field__control:hover { border-color: var(--border-strong); }
.ds-field__control:focus { outline: none; border-color: var(--brand-400); box-shadow: 0 0 0 3px var(--focus-ring); }
.ds-field__control:disabled { background: var(--surface-sunken); color: var(--text-muted); cursor: not-allowed; }
.ds-field--has-prefix .ds-field__control { padding-left: 30px; }
.ds-field__affix { position: absolute; color: var(--text-muted); font-size: var(--text-sm); pointer-events: none; }
.ds-field__affix--prefix { left: 11px; }
.ds-field--error .ds-field__control { border-color: var(--danger); }
.ds-field--error .ds-field__control:focus { box-shadow: 0 0 0 3px var(--danger-50); }
.ds-field__msg { font-size: var(--text-xs); margin-top: var(--space-1); }
.ds-field__msg--err { color: var(--danger); }
.ds-field__msg--hint { color: var(--text-muted); }
`);

/** Labelled text field — the back-office/form workhorse. */
export function Input({
  label,
  hint,
  error,
  required = false,
  prefix = null,
  id,
  className = '',
  ...rest
}) {
  const fid = id || (label ? 'ds-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const cls = ['ds-field', prefix ? 'ds-field--has-prefix' : '', error ? 'ds-field--error' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {label && (
        <label className="ds-field__label" htmlFor={fid}>
          {label}{required && <span className="ds-field__req">*</span>}
        </label>
      )}
      <div className="ds-field__wrap">
        {prefix && <span className="ds-field__affix ds-field__affix--prefix">{prefix}</span>}
        <input id={fid} className="ds-field__control" aria-invalid={!!error} {...rest} />
      </div>
      {error
        ? <div className="ds-field__msg ds-field__msg--err">{error}</div>
        : hint ? <div className="ds-field__msg ds-field__msg--hint">{hint}</div> : null}
    </div>
  );
}
