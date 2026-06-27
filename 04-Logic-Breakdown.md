# Consumer Data Manager — Frontend Logic Breakdown

**Status:** 📝 Planning  
**Owner:** Frontend Developer  
**Deadline:** 8 Juli 2026

---

## 📦 State Structure

```javascript
const appState = {
  // Auth
  auth: {
    user: { id, email, nama, role },
    token: "JWT...",
    isAuthenticated: true
  },
  
  // Konsumen
  konsumen: {
    all: ["id1", "id2"], // Array of IDs
    entities: {
      "id1": { id, nama_toko, pemilik, kontak_wa, alamat, lat, lng },
      "id2": { ... }
    },
    isLoading: false,
    filter: { search: "", status: "aktif" },
    selectedId: null
  },
  
  // Orders
  orders: {
    all: ["ord1", "ord2"],
    entities: {
      "ord1": { id, nomor_order, konsumen_id, items: [], total, status }
    },
    filter: { status: "all", dateRange: null },
    isLoading: false
  },
  
  // Barang (Inventory)
  barang: {
    all: ["bar1", "bar2"],
    entities: {
      "bar1": { id, nama, hpp, harga_jual, stok, kategori }
    },
    isLoading: false
  },
  
  // UI State
  ui: {
    sidebarOpen: true,
    currentPage: "dashboard",
    modals: {
      createOrder: { isOpen: false },
      editKonsumen: { isOpen: false, konsumenId: null }
    },
    notifications: [
      { id: "n1", type: "success", message: "Order created!" }
    ]
  }
}
```

---

## 🎯 Key Events & Handlers

### **Konsumen Management**

**Event: Create Konsumen**
```
Trigger: Submit form in "Create Konsumen" modal
Input: { nama_toko, pemilik, kontak_wa, alamat, lat, lng }
Processing:
  1. Validate inputs locally
  2. Call POST /api/konsumen
  3. On success: Add to state.konsumen.entities
  4. Show success toast
  5. Close modal
  6. Refresh list (optional)
Error:
  - Duplicate kontak_wa: Show error message
  - Network error: Show retry button
```

**Event: Search Konsumen**
```
Trigger: Type in search box
Input: search string
Processing:
  1. Debounce input (300ms)
  2. Filter konsumen.all by nama_toko (case-insensitive)
  3. Update state.konsumen.filter.search
  4. UI automatically updates (derived state)
```

**Event: Filter by Status**
```
Trigger: Click status filter buttons
Input: status (aktif, tidak_aktif, all)
Processing:
  1. Update state.konsumen.filter.status
  2. UI shows only matching konsumen
  3. Reset pagination to page 1
```

---

### **Order Management**

**Event: Create Order**
```
Trigger: Submit form in "New Order" page
Input: { konsumen_id, items: [{barang_id, jumlah}], catatan }
Processing:
  1. Validate: konsumen exists, items not empty, stok available
  2. Calculate total (qty × harga_jual per item)
  3. Call POST /api/orders
  4. On success:
     a. Add order to state.orders.entities
     b. Auto-show invoice modal
     c. Show toast: "Order created & invoice generated"
  5. Redirect to order detail
Error:
  - Stok kurang: Highlight item & show error
  - Invalid konsumen: Show validation error
```

**Event: Confirm Order**
```
Trigger: Click "Confirm Order" button
Processing:
  1. Show confirmation modal
  2. On confirm: Call PUT /api/orders/:id/confirm
  3. Update order status → "confirmed"
  4. Deduct stok (backend does this)
  5. Show success toast: "Order confirmed"
```

**Event: Select Items for Order**
```
Trigger: Click "Add item" in order form
Input: barang_id
Processing:
  1. Find barang from state.barang.entities
  2. Check stok availability
  3. Add to order.items array (local state)
  4. Auto-calculate subtotal (qty × harga)
  5. Update total (sum of all subtotals)
  6. UI shows item in table
```

---

### **Invoice Management**

**Event: Record Payment**
```
Trigger: Submit payment form in invoice detail
Input: { invoice_id, jumlah_pembayaran, tanggal }
Processing:
  1. Call POST /api/invoices/:id/payment
  2. Update invoice status:
     - If total paid = total → "lunas"
     - If 0 < total paid < total → "sebagian"
     - If total paid = 0 → "belum"
  3. Update state.orders.entities (show payment status)
  4. Show success toast: "Pembayaran tercatat"
```

---

### **Inventory Management**

**Event: Input Barang Masuk**
```
Trigger: Submit form in "Input Barang Masuk"
Input: { barang_id, jumlah, keterangan }
Processing:
  1. Validate: barang exists, jumlah > 0
  2. Call POST /api/stok/masuk
  3. Update state.barang.entities[barang_id].stok
  4. Add to stok_history (list view)
  5. Check if above max stok (warning)
  6. Show success toast
```

**Event: Update Harga** (Admin only)
```
Trigger: Edit harga in inventory list
Input: { barang_id, new_harga_jual }
Processing:
  1. Call PUT /api/barang/:id/harga
  2. Update state.barang.entities[barang_id].harga_jual
  3. Recalculate margin%
  4. Show success toast
```

---

### **Pengiriman (Delivery)**

**Event: Create Delivery Route**
```
Trigger: Select orders & click "Create Delivery"
Input: [order_ids]
Processing:
  1. Get konsumen GPS from orders
  2. Call POST /api/pengiriman (backend calls Google Maps API)
  3. Receive optimized route back
  4. Show route on map with sequence numbers
  5. Allow driver assignment
  6. On confirm: Create pengiriman record
  7. Show success toast
```

**Event: Update Delivery Status**
```
Trigger: Click status button in delivery tracking
Input: { pengiriman_id, new_status }
Processing:
  1. Call PUT /api/pengiriman/:id/status
  2. Update state (pengiriman + order)
  3. If status = "completed" → mark order as "selesai"
  4. Notify admin (push notification)
  5. Show toast: "Delivery status updated"
```

---

### **Broadcasting**

**Event: Send Bulk Message**
```
Trigger: Submit form in "Send Message"
Input: [konsumen_ids], message_template, custom_text
Processing:
  1. Validate: at least 1 konsumen selected
  2. Prepare message (replace template variables)
  3. Call POST /api/broadcast/send
  4. Show confirmation: "Sending to N konsumen..."
  5. Show toast when complete: "Messages sent"
  6. Add to broadcast history
```

---

## 🔄 Data Flow Example

**User creates new order:**
```
User fills form (konsumen + items)
  ↓
Click "Create Order" button
  ↓
Form validation (client-side)
  ↓
POST /api/orders
  ↓
On success: Response includes order + invoice
  ↓
Update state:
  - Add order to orders.entities
  - Show order detail
  - Prepare invoice for display
  ↓
Show success toast + auto-scroll to invoice
  ↓
User can print/download invoice
```

---

## 🎭 Loading & Error States

### **Loading State**
```javascript
if (state.orders.isLoading) {
  return <LoadingSpinner />
}
```

### **Error State**
```javascript
if (state.ui.notifications.some(n => n.type === 'error')) {
  return <ErrorAlert message={notification.message} onRetry={retry} />
}
```

### **Empty State**
```javascript
if (orders.all.length === 0) {
  return <EmptyState message="No orders yet" action="Create order" />
}
```

---

## ⚡ Performance Optimizations

1. **Memoization**
   - Memoize filtered konsumen list
   - Memoize calculated totals
   - Use React.memo for list items

2. **Pagination**
   - Load 20 items per page
   - Lazy load next page on scroll

3. **Caching**
   - Cache barang list (1 hour TTL)
   - Cache konsumen list (15 min TTL)
   - Cache user data (session)

4. **Debouncing**
   - Search input: 300ms
   - Filter changes: 200ms

---

## 🧪 Testing Strategy

### **Unit Tests**
- [ ] State selectors (filterKonsumen, calculateTotal)
- [ ] Event handlers (onCreateOrder, onPayment)
- [ ] Validation logic (validateKonsumen, validateOrder)
- [ ] Calculations (margin%, totals)

### **Integration Tests**
- [ ] Create order → auto-generate invoice
- [ ] Record payment → update status
- [ ] Input barang → update stok
- [ ] Create delivery → show map

### **Edge Cases**
- [ ] Stok = 0, order submitted
- [ ] Multiple items, calculate total
- [ ] Payment > total, handle
- [ ] Concurrent updates

---

## ✅ Checklist

- [ ] State structure designed
- [ ] All events documented
- [ ] Data flow clear
- [ ] Loading/error states planned
- [ ] Performance optimization considered
- [ ] Testing strategy outlined

---

**Status:** Ready for Integration & Testing  
**Next:** → 05-Integration-Breakdown.md
