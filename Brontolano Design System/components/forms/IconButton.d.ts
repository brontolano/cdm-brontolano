import * as React from 'react';

export type IconButtonSize = 'sm' | 'md' | 'lg';

/** Square icon-only button (steppers, close, back, row actions). */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "md" — lg is the 44px touch target for mobile/PWA. */
  size?: IconButtonSize;
  /** Hairline + white fill (e.g. stepper +/− buttons). */
  outline?: boolean;
  /** Accessible name — required (button has no visible text). */
  label?: string;
  /** The icon node (Lucide <i>, svg, or an emoji glyph). */
  children?: React.ReactNode;
}

export declare function IconButton(props: IconButtonProps): React.JSX.Element;
