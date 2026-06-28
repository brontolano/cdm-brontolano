**CartBar** — the floating green bar that surfaces the cart on the public catalog (count · total · CTA), carrying the commerce-glow shadow. Use `fixed` to pin it to the bottom of the viewport.

```jsx
{totalQty > 0 && (
  <CartBar count={totalQty} total={total} fixed onClick={() => setShowCart(true)} />
)}
```
