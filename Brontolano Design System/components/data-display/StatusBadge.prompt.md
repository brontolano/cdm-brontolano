**StatusBadge** — colors itself from a domain status string (order / payment / konsumen). Use it in tables and detail headers.

```jsx
<StatusBadge status="selesai" />
<StatusBadge status="belum" />
<StatusBadge status="tidak_aktif" />   {/* renders "tidak aktif" */}
```

Known statuses: order `draft·confirmed·proses·dikirim·selesai·dibatalkan`, payment `lunas·sebagian·belum`, konsumen `aktif·tidak_aktif`. Unknown → draft (slate). Override the label with `children`.
