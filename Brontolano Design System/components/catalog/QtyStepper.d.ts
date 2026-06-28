import * as React from 'react';

export type QtyStepperSize = 'sm' | 'md';

/** −/value/+ quantity control used across catalog, POS and cart. */
export interface QtyStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current quantity. */
  value?: number;
  /** Change handler — receives the clamped next value. */
  onChange?: (next: number) => void;
  /** @default 0 */
  min?: number;
  /** @default Infinity */
  max?: number;
  /** @default "md" (md buttons are 38px touch targets) */
  size?: QtyStepperSize;
  /** Stretch the number field to fill (card footer). */
  block?: boolean;
}

export declare function QtyStepper(props: QtyStepperProps): React.JSX.Element;
