import * as React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

/** Native <select> styled with brand chrome. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Convenience option list — strings or {value,label}. Or pass <option> children. */
  options?: Array<string | SelectOption>;
  /** Leading empty/placeholder option ("— pilih konsumen —"). */
  placeholder?: string;
}

export declare function Select(props: SelectProps): React.JSX.Element;
