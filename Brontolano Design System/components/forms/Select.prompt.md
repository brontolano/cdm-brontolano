**Select** — native dropdown with brand chrome. Pass `options` (strings or `{value,label}`) or `<option>` children, and a `placeholder` for the empty lead.

```jsx
<Select placeholder="— pilih konsumen —" options={konsumen.map(k => ({ value: k.id, label: k.nama_toko }))} />
<Select options={['Harian', 'Mingguan', 'Bulanan']} value={period} onChange={...} />
```

Props: `options`, `placeholder`, plus native `<select>` attrs (`value`, `onChange`, `disabled`).
