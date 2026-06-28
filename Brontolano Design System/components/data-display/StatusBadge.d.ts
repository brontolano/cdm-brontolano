import * as React from 'react';

export type OrderStatus =
  | 'draft' | 'confirmed' | 'proses' | 'dikirim' | 'selesai' | 'dibatalkan';
export type PaymentStatus = 'lunas' | 'sebagian' | 'belum';
export type KonsumenStatus = 'aktif' | 'tidak_aktif';
export type AnyStatus = OrderStatus | PaymentStatus | KonsumenStatus;

/** Pill that colors itself from a domain status string. */
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Order, payment, or konsumen status — drives the color pair. */
  status: AnyStatus | string;
  /** Override the visible label (defaults to the status, underscores → spaces). */
  children?: React.ReactNode;
}

export declare function StatusBadge(props: StatusBadgeProps): React.JSX.Element;
