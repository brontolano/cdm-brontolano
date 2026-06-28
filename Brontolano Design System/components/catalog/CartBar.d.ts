import * as React from 'react';

/** Floating green summary bar for the catalog cart (count · total · CTA). */
export interface CartBarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Item count. */
  count?: number;
  /** Cart total in Rupiah. */
  total?: number;
  /** Right-side call to action. @default "Lihat Keranjang →" */
  label?: string;
  /** Pin to the bottom of the viewport (real catalog use). */
  fixed?: boolean;
}

export declare function CartBar(props: CartBarProps): React.JSX.Element;
