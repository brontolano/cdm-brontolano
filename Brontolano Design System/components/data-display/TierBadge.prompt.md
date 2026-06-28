**TierBadge** — the wholesale price tier (HET·S1·S2·S3·S4). Plain by default; `active` for the currently-selected tier; `hot` to flag a live discount in brand red with a 🔥.

```jsx
<TierBadge tier="HET" range />          {/* "HET 1–5 krtn" */}
<TierBadge tier="S2" active />
<TierBadge tier="S2" hot />             {/* 🔥 red — discount active */}
```

Ranges are built in: HET 1–5, S1 6–9, S2 10–24, S3 25–150, S4 >150 (cartons).
