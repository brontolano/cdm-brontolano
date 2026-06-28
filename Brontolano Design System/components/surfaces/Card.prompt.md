**Card** — the white, hairline-bordered surface that holds panels, tables and forms on the slate page. Use `flush` for tables (no padding), `accent` for a red top rule, `interactive` for clickable cards.

```jsx
<Card title="Order Terbaru" actions={<Button size="sm" variant="ghost">Lihat semua</Button>}>…</Card>
<Card flush><table>…</table></Card>
<Card interactive onClick={open}>…</Card>
```
