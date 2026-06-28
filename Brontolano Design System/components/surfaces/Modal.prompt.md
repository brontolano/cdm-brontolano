**Modal** — centered dialog over a slate scrim; closes on ✕, scrim click, and Esc. Render it conditionally (only when open). Put actions in `footer`.

```jsx
{open && (
  <Modal title="Tambah Konsumen" onClose={() => setOpen(false)}
    footer={<><Button variant="secondary" onClick={close}>Batal</Button><Button onClick={save}>Simpan</Button></>}>
    <Input label="Nama Toko" required />
  </Modal>
)}
```

Props: `title`, `onClose`, `footer`, `width` (default 520).
