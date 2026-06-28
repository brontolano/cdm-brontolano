import * as React from 'react';

/** Centered modal dialog over a slate scrim (forms, confirmations, invoice view). */
export interface ModalProps {
  /** Header title. */
  title?: React.ReactNode;
  /** Close handler — wired to the ✕, scrim click, and Esc. */
  onClose?: () => void;
  /** Right-aligned footer actions (Batal / Simpan). */
  footer?: React.ReactNode;
  /** Max width in px. @default 520 */
  width?: number;
  children?: React.ReactNode;
}

export declare function Modal(props: ModalProps): React.JSX.Element;
