import * as React from 'react';

/** Dashboard summary tile — label, big value, optional delta. */
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metric name, e.g. "Omset Bulan Ini". */
  label: string;
  /** Big value — pre-formatted (use rupiah() for money). */
  value: React.ReactNode;
  /** Optional leading glyph/icon (emoji or Lucide node). */
  icon?: React.ReactNode;
  /** Optional change indicator, e.g. "12%" or "3 toko". */
  delta?: React.ReactNode;
  /** @default "up" */
  deltaDir?: 'up' | 'down';
  /** Red top accent rule for the hero metric. */
  accent?: boolean;
}

export declare function StatCard(props: StatCardProps): React.JSX.Element;
