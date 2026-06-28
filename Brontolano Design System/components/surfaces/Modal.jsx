import React from 'react';

function injectOnce(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

injectOnce('ds-modal', `
.ds-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex; align-items: center; justify-content: center;
  padding: var(--space-4);
  z-index: var(--z-overlay);
  animation: ds-modal-fade var(--dur-base) var(--ease-out);
}
.ds-modal {
  background: var(--surface-card);
  border-radius: var(--radius-lg);
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: var(--shadow-xl);
  animation: ds-modal-pop var(--dur-base) var(--ease-out);
}
.ds-modal__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-5) var(--space-5) var(--space-3); }
.ds-modal__title { font-size: var(--text-xl); font-weight: 700; letter-spacing: var(--tracking-tight); margin: 0; }
.ds-modal__close { border: none; background: transparent; font-size: 20px; line-height: 1; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: var(--radius-sm); }
.ds-modal__close:hover { background: var(--surface-hover); color: var(--text); }
.ds-modal__body { padding: 0 var(--space-5) var(--space-5); }
.ds-modal__foot { display: flex; gap: var(--space-3); justify-content: flex-end; padding: var(--space-3) var(--space-5) var(--space-5); }
@keyframes ds-modal-fade { from { opacity: 0; } }
@keyframes ds-modal-pop { from { opacity: 0; transform: translateY(8px) scale(.98); } }
`);

/** Centered dialog over a scrim. Click-scrim and Esc close. */
export function Modal({ title, onClose, footer = null, width = 520, children }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
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
