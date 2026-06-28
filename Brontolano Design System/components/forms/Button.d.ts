import * as React from 'react';

export type ButtonVariant =
  | 'primary'    // Brontolano red — the one most-important action
  | 'secondary'  // slate fill — neutral / cancel
  | 'ghost'      // hairline outline — tertiary
  | 'danger'     // destructive only (delete)
  | 'commerce'   // green — add to cart / checkout / go
  | 'whatsapp';  // WhatsApp green — order / broadcast channel

export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Brontolano button. Sentence-case labels, one primary per view.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual intent. @default "primary" */
  variant?: ButtonVariant;
  /** @default "md" */
  size?: ButtonSize;
  /** Stretch to full container width. */
  block?: boolean;
  /** Icon node rendered before the label (e.g. a Lucide <i> or svg). */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): React.JSX.Element;
