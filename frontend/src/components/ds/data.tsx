import React from 'react';

const STATUS_MAP: Record<string, [string, string]> = {
  draft: ['--badge-draft-bg', '--badge-draft-fg'],
  confirmed: ['--badge-confirmed-bg', '--badge-confirmed-fg'],
  proses: ['--badge-proses-bg', '--badge-proses-fg'],
  dikirim: ['--badge-dikirim-bg', '--badge-dikirim-fg'],
  selesai: ['--badge-selesai-bg', '--badge-selesai-fg'],
  dibatalkan: ['--badge-batal-bg', '--badge-batal-fg'],
  lunas: ['--badge-lunas-bg', '--badge-lunas-fg'],
  sebagian: ['--badge-sebagian-bg', '--badge-sebagian-fg'],
  belum: ['--badge-belum-bg', '--badge-belum-fg'],
  aktif: ['--badge-aktif-bg', '--badge-aktif-fg'],
  tidak_aktif: ['--badge-nonaktif-bg', '--badge-nonaktif-fg'],
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

/** Domain status pill — colors itself from the status string. */
export function StatusBadge({ status, children, className = '', ...rest }: StatusBadgeProps) {
  const key = String(status || '').toLowerCase();
  const [bg, fg] = STATUS_MAP[key] || STATUS_MAP.draft;
  const label = children != null ? children : key.replace('_', ' ');
  return (
    <span className={['ds-badge', className].filter(Boolean).join(' ')} style={{ background: `var(${bg})`, color: `var(${fg})` }} {...rest}>
      {label}
    </span>
  );
}

const TIER_RANGES: Record<string, string> = { HET: '1–4', S1: '5–9', S2: '10–24', S3: '25–49', S4: '≥50' };

export interface TierBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tier?: string;
  range?: boolean;
  hot?: boolean;
  active?: boolean;
}

/** Wholesale tier pill (HET·S1–S4). hot = active discount (brand red). */
export function TierBadge({ tier = 'HET', range = false, hot = false, active = false, className = '', ...rest }: TierBadgeProps) {
  const key = String(tier).toUpperCase();
  const cls = ['ds-tier', hot ? 'ds-tier--hot' : active ? 'ds-tier--active' : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {hot && <span aria-hidden="true">🔥</span>}
      {key}
      {range && <span className="ds-tier__range">{TIER_RANGES[key] || ''} krtn</span>}
    </span>
  );
}

/** Format a number as Indonesian Rupiah ("Rp 1.250.000"). */
export function rupiah(n: number | string | null | undefined): string {
  const v = Number(n) || 0;
  return 'Rp ' + v.toLocaleString('id-ID');
}

export interface PriceProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  unit?: string;
  perPcs?: number | null;
  isi?: number | null;
  size?: 'sm' | 'md' | 'lg';
}

/** Rupiah price display with optional unit and per-pcs breakdown. */
export function Price({ amount, unit = 'karton', perPcs = null, isi = null, size = 'md', className = '', ...rest }: PriceProps) {
  return (
    <div className={['ds-price', `ds-price--${size}`, className].filter(Boolean).join(' ')} {...rest}>
      <span className="ds-price__main">{rupiah(amount)}</span>
      {unit && <span className="ds-price__unit"> /{unit}</span>}
      {perPcs != null && <span className="ds-price__pcs">≈ {rupiah(perPcs)} /pcs{isi ? ` · isi ${isi}` : ''}</span>}
    </div>
  );
}

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  delta?: string | null;
  deltaDir?: 'up' | 'down';
  accent?: boolean;
}

/** Dashboard summary tile (Konsumen Aktif, Omset Bulan Ini, Piutang…). */
export function StatCard({ label, value, icon = null, delta = null, deltaDir = 'up', accent = false, className = '', ...rest }: StatCardProps) {
  const cls = ['ds-stat', accent ? 'ds-stat--accent' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="ds-stat__top">
        <span className="ds-stat__label">{label}</span>
        {icon && <span className="ds-stat__icon" aria-hidden="true">{icon}</span>}
      </div>
      <div className="ds-stat__value">{value}</div>
      {delta != null && <div className={`ds-stat__delta ds-stat__delta--${deltaDir}`}>{deltaDir === 'up' ? '▲' : '▼'} {delta}</div>}
    </div>
  );
}
