**IconButton** — square, icon-only button for steppers, close/back chrome, and table-row actions; default to `size="lg"` (44px) on touch surfaces.

```jsx
<IconButton label="Tutup" onClick={close}><i data-lucide="x" /></IconButton>
<IconButton label="Kurangi" size="lg" outline onClick={dec}>−</IconButton>
```

Props: `size` (`sm | md | lg`), `outline` (hairline + white fill, used for stepper buttons), `label` (required aria-label), plus native `<button>` attrs.
