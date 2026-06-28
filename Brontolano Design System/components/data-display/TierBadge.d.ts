import * as React from 'react';

export type Tier = 'HET' | 'S1' | 'S2' | 'S3' | 'S4';

/** Wholesale price-tier pill — the brand's signature pricing motif. */
export interface TierBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "HET" */
  tier?: Tier | string;
  /** Append the carton range (e.g. "10–24 krtn"). */
  range?: boolean;
  /** Active discount — fills brand red with a 🔥. Use on a product card when a tier discount is live. */
  hot?: boolean;
  /** Soft green emphasis (selected tier, not a discount). */
  active?: boolean;
}

export declare function TierBadge(props: TierBadgeProps): React.JSX.Element;
