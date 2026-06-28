**QtyStepper** — the −/value/+ control for cartons. Controlled: pass `value` and `onChange`. `block` stretches it to a card footer; `md` buttons are 38px touch targets.

```jsx
<QtyStepper value={qty} onChange={setQty} min={0} block />
<QtyStepper value={qty} onChange={setQty} size="sm" />
```
