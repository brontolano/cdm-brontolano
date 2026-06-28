import * as React from 'react';

/** Labelled text input with hint / error states. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Field label (sentence case). */
  label?: string;
  /** Helper text shown below when there is no error. */
  hint?: string;
  /** Error message — turns the control red and shows below. */
  error?: string;
  /** Appends a red asterisk to the label. */
  required?: boolean;
  /** Static prefix inside the control (e.g. "Rp", "+62"). */
  prefix?: React.ReactNode;
}

export declare function Input(props: InputProps): React.JSX.Element;
