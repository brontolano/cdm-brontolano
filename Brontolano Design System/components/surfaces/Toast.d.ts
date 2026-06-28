import * as React from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

/** Single toast notification. Stack them bottom-right inside a `.ds-toast-wrap`. */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "info" */
  type?: ToastType;
  /** Override the leading glyph. */
  icon?: React.ReactNode;
  /** Message body. */
  children?: React.ReactNode;
}

export declare function Toast(props: ToastProps): React.JSX.Element;
