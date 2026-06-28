**Toast** — transient confirmation, bottom-right. Name the result in the message ("Order ORD-00123 dibuat"). Stack multiple inside a `<div className="ds-toast-wrap">`.

```jsx
<div className="ds-toast-wrap">
  <Toast type="success">Stok Indomie bertambah 24</Toast>
  <Toast type="error">Gagal menyimpan — periksa koneksi</Toast>
</div>
```

Types: `success | error | info | warning`.
