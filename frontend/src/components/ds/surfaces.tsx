import React from 'react';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  flush?: boolean;
  accent?: boolean;
  interactive?: boolean;
}

/** The white, hairline-bordered container that holds almost everything. */
export function Card({ title = null, actions = null, flush = false, accent = false, interactive = false, className = '', children, ...rest }: CardProps) {
  const cls = ['ds-card', flush ? 'ds-card--flush' : '', accent ? 'ds-card--accent' : '', interactive ? 'ds-card--interactive' : '', className].filter(Boolean).join(' ');
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

export interface ModalProps {
  title?: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
  width?: number;
  children?: React.ReactNode;
}

/** Centered dialog over a scrim. Click-scrim and Esc close. */
export function Modal({ title, onClose, footer = null, width = 520, children }: ModalProps) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="ds-modal-overlay" onClick={onClose}>
      <div className="ds-modal" style={{ maxWidth: width }} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="ds-modal__head">
          <h3 className="ds-modal__title">{title}</h3>
          {onClose && <button className="ds-modal__close" aria-label="Tutup" onClick={onClose}>✕</button>}
        </div>
        <div className="ds-modal__body">{children}</div>
        {footer && <div className="ds-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}

type ToastType = 'success' | 'error' | 'info' | 'warning';
const TOAST_ICON: Record<ToastType, string> = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: ToastType;
  icon?: React.ReactNode;
}

/** A single toast notification (bottom-right of the back-office). */
export function Toast({ type = 'info', children, icon, className = '', ...rest }: ToastProps) {
  return (
    <div className={['ds-toast', `ds-toast--${type}`, className].filter(Boolean).join(' ')} role="status" {...rest}>
      <span className="ds-toast__icon" aria-hidden="true">{icon != null ? icon : TOAST_ICON[type]}</span>
      <span>{children}</span>
    </div>
  );
}
