import * as React from 'react';

/** Public-catalog product card — composes QtyStepper; shows tiered price. */
export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Product name (clamped to 2 lines). */
  name: string;
  /** SKU code (mono). */
  sku?: string;
  /** Size/packaging note, e.g. "Karton/Dus". */
  size?: string;
  /** Category — shown as a green tag over the image. */
  category?: string;
  /** Image URL; falls back to a 📦 placeholder. */
  image?: string | null;
  /** Price per carton at the current quantity. */
  price: number;
  /** Optional per-piece price (green line). */
  perPcs?: number | null;
  /** Pieces per carton ("· isi 24"). */
  isi?: number | null;
  /** When a quantity discount is live, the tier code (e.g. "S2") — shows a red 🔥 tag. */
  hotTier?: string | null;
  /** Original (HET) price — shown struck-through next to the discounted price. */
  wasPrice?: number | null;
  /** Per-carton savings vs HET — renders a value-first "Hemat Rp X/karton" pill. */
  saving?: number;
  /** Current cart quantity (0 → shows "+ Keranjang"). */
  qty?: number;
  /** Quantity change handler. */
  onQty?: (next: number) => void;
}

export declare function ProductCard(props: ProductCardProps): React.JSX.Element;
