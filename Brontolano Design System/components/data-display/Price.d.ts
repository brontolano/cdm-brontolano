import * as React from 'react';

/** Format a number as Indonesian Rupiah, e.g. rupiah(1250000) → "Rp 1.250.000".
 *  Module export for production imports — NOT exposed on window.<Namespace>
 *  (lowercase names aren't bundled to the global). In HTML/@dsCard consumers,
 *  use <Price unit=""> or a local one-liner. */
export declare function rupiah(n: number | string): string;

export type PriceSize = 'sm' | 'md' | 'lg';

/** Rupiah price with optional unit + per-pcs breakdown (the catalog price block). */
export interface PriceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Amount in Rupiah (number or numeric string). */
  amount: number | string;
  /** Unit suffix after the slash. @default "karton" — pass "" to hide. */
  unit?: string;
  /** Optional per-piece price shown in green below. */
  perPcs?: number | null;
  /** Pieces-per-carton, appended to the per-pcs line ("· isi 24"). */
  isi?: number | null;
  /** @default "md" */
  size?: PriceSize;
}

export declare function Price(props: PriceProps): React.JSX.Element;
