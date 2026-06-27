import { ReactNode } from 'react';

export function Spinner() {
  return <div className="spinner">Memuat…</div>;
}

export function EmptyState({ message }: { message: string }) {
  return <div className="empty">{message}</div>;
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function Badge({ value }: { value: string }) {
  return <span className={`badge ${value}`}>{value.replace('_', ' ')}</span>;
}

export function rupiah(n: number | string): string {
  const v = Number(n) || 0;
  return 'Rp ' + v.toLocaleString('id-ID');
}
