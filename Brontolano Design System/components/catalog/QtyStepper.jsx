import React from 'react';

function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

injectOnce('ds-stepper', `
.ds-stepper { display: inline-flex; align-items: center; gap: 6px; }
.ds-stepper__btn {
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--border-strong);
  background: var(--surface-card);
  color: var(--text);
  border-radius: var(--radius-md);
  font-weight: 700; line-height: 1; cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
}
.ds-stepper__btn:hover { background: var(--surface-hover); border-color: var(--slate-400); }
.ds-stepper__btn:active { background: var(--slate-200); }
.ds-stepper__btn:disabled { opacity: .4; cursor: not-allowed; }
.ds-stepper__input {
  text-align: center;
  font-family: var(--font-sans);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  color: var(--text);
  background: var(--surface-card);
}
.ds-stepper__input:focus { outline: none; border-color: var(--brand-400); box-shadow: 0 0 0 3px var(--focus-ring); }
.ds-stepper--sm .ds-stepper__btn { width: 30px; height: 30px; font-size: 16px; }
.ds-stepper--sm .ds-stepper__input { width: 40px; height: 30px; font-size: 14px; }
.ds-stepper--md .ds-stepper__btn { width: 38px; height: 38px; font-size: 20px; }
.ds-stepper--md .ds-stepper__input { width: 52px; height: 38px; font-size: 15px; }
.ds-stepper--block { display: flex; }
.ds-stepper--block .ds-stepper__input { flex: 1; }
`);

/** −/value/+ quantity control — catalog cards, POS rows, cart sheet. */
export function QtyStepper({ value = 0, onChange, min = 0, max = Infinity, size = 'md', block = false, className = '', ...rest }) {
  const set = (v) => { if (onChange) onChange(Math.max(min, Math.min(max, v))); };
  const cls = ['ds-stepper', `ds-stepper--${size}`, block ? 'ds-stepper--block' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <button type="button" className="ds-stepper__btn" aria-label="Kurangi" onClick={() => set(value - 1)} disabled={value <= min}>−</button>
      <input
        className="ds-stepper__input"
        inputMode="numeric"
        value={value}
        aria-label="Jumlah"
        onChange={(e) => set(parseInt(e.target.value, 10) || 0)}
      />
      <button type="button" className="ds-stepper__btn" aria-label="Tambah" onClick={() => set(value + 1)} disabled={value >= max}>+</button>
    </div>
  );
}
