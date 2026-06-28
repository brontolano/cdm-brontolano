import React from 'react';

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'commerce' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: Size;
  block?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

/** Brontolano primary button. Red = brand; commerce/whatsapp = catalog order actions; danger = destructive only. */
export function Button({
  variant = 'primary', size = 'md', block = false,
  iconLeft = null, iconRight = null, className = '', type = 'button', children, ...rest
}: ButtonProps) {
  const cls = ['ds-btn', `ds-btn--${variant}`, `ds-btn--${size}`, block ? 'ds-btn--block' : '', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {iconLeft}
      {children != null && <span>{children}</span>}
      {iconRight}
    </button>
  );
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  outline?: boolean;
  label: string;
}

/** Square ≥44px-friendly icon button — steppers, close ✕, row actions. Pass a label (no text). */
export function IconButton({ size = 'md', outline = false, label, className = '', children, ...rest }: IconButtonProps) {
  const cls = ['ds-iconbtn', `ds-iconbtn--${size}`, outline ? 'ds-iconbtn--outline' : '', className].filter(Boolean).join(' ');
  return <button type="button" className={cls} aria-label={label} {...rest}>{children}</button>;
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;
}

/** Labelled text field — the back-office/form workhorse. */
export function Input({ label, hint, error, required = false, prefix = null, id, className = '', ...rest }: InputProps) {
  const fid = id || (label ? 'ds-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const cls = ['ds-field', prefix ? 'ds-field--has-prefix' : '', error ? 'ds-field--error' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {label && <label className="ds-field__label" htmlFor={fid}>{label}{required && <span className="ds-field__req">*</span>}</label>}
      <div className="ds-field__wrap">
        {prefix && <span className="ds-field__affix ds-field__affix--prefix">{prefix}</span>}
        <input id={fid} className="ds-field__control" aria-invalid={!!error} required={required} {...rest} />
      </div>
      {error
        ? <div className="ds-field__msg ds-field__msg--err">{error}</div>
        : hint ? <div className="ds-field__msg ds-field__msg--hint">{hint}</div> : null}
    </div>
  );
}

type Opt = string | { value: string; label: string };
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Opt[];
  placeholder?: string;
}

/** Native select with brand chrome (caret, focus ring). */
export function Select({ options = [], placeholder, className = '', children, ...rest }: SelectProps) {
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
