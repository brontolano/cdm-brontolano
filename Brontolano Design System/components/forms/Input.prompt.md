**Input** — labelled text field for forms (konsumen, barang, checkout). Real-time `error` turns it red; `hint` shows helper copy otherwise.

```jsx
<Input label="Nama Toko" required placeholder="Toko Berkah Jaya" />
<Input label="Kontak WA" prefix="+62" placeholder="81234…" />
<Input label="Alamat" error="Minimal 5 karakter" />
```

Props: `label`, `hint`, `error`, `required`, `prefix`, plus all native `<input>` attrs (`type`, `value`, `onChange`, `placeholder`, `inputMode`…).
