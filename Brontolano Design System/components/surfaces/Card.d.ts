import * as React from 'react';

/** White hairline container — the base surface for panels, tables, forms. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional header title (renders an <h3> + divider row). */
  title?: React.ReactNode;
  /** Right-aligned header actions (buttons, selects). */
  actions?: React.ReactNode;
  /** Remove padding — for tables/lists that reach the edges. */
  flush?: boolean;
  /** Red top accent rule. */
  accent?: boolean;
  /** Hover lift — use when the whole card is a link/target. */
  interactive?: boolean;
  children?: React.ReactNode;
}

export declare function Card(props: CardProps): React.JSX.Element;
