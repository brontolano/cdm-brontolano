# Consumer Data Manager — API Breakdown

**Status:** 📝 Planning  
**API Style:** RESTful JSON  
**Version:** v1

---

## 🔌 API Endpoints

### **Authentication**
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh-token
```

---

### **Konsumen Management**
```
GET    /api/v1/konsumen              ← List with pagination & filter
GET    /api/v1/konsumen/:id          ← Get single
POST   /api/v1/konsumen              ← Create
PUT    /api/v1/konsumen/:id          ← Update
DELETE /api/v1/konsumen/:id          ← Soft delete
GET    /api/v1/konsumen/search       ← Search by nama/kontak
GET    /api/v1/konsumen/map          ← Get all with GPS for map
```

---

### **Order Management**
```
GET    /api/v1/orders                ← List dengan filter (status, date)
GET    /api/v1/orders/:id            ← Get order + items
POST   /api/v1/orders                ← Create order
PUT    /api/v1/orders/:id            ← Update order (draft only)
POST   /api/v1/orders/:id/confirm    ← Confirm order (final)
POST   /api/v1/orders/:id/cancel     ← Cancel order
```

---

### **Invoice Management**
```
GET    /api/v1/invoices              ← List
GET    /api/v1/invoices/:id          ← Get invoice
POST   /api/v1/invoices/:id/payment  ← Record payment
GET    /api/v1/invoices/:id/pdf      ← Download PDF
```

---

### **Inventory Management**
```
GET    /api/v1/barang                ← List items with stok
GET    /api/v1/barang/:id            ← Get item
PUT    /api/v1/barang/:id/harga      ← Update harga (admin only)
POST   /api/v1/stok/masuk            ← Input barang masuk
GET    /api/v1/stok/history          ← View stok audit trail
```

---

### **Pengiriman (Delivery)**
```
POST   /api/v1/pengiriman            ← Create delivery route
GET    /api/v1/pengiriman            ← List deliveries
GET    /api/v1/pengiriman/:id        ← Get delivery with route
PUT    /api/v1/pengiriman/:id/status ← Update status (in_transit, completed)
GET    /api/v1/pengiriman/:id/route  ← Get optimized route (map)
```

---

### **WhatsApp Broadcasting**
```
POST   /api/v1/broadcast/send        ← Send bulk WA message
POST   /api/v1/broadcast/template    ← Create message template
GET    /api/v1/broadcast/status      ← Check delivery status
```

---

### **Dashboard & Analytics**
```
GET    /api/v1/dashboard/summary     ← Omset, orders, stok overview
GET    /api/v1/dashboard/omset       ← Omset by date range
GET    /api/v1/dashboard/inventory   ← Stok status
GET    /api/v1/dashboard/report      ← Generate report (PDF/Excel)
```

---

## 📝 Example: Create Order

**Request:**
```json
POST /api/v1/orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "konsumen_id": "uuid-123",
  "items": [
    { "barang_id": "uuid-456", "jumlah": 5 },
    { "barang_id": "uuid-789", "jumlah": 2 }
  ],
  "catatan": "Order from Tim Lapangan"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "order_id": "uuid-order-1",
    "nomor_order": "ORD-2026-001",
    "konsumen": { "id": "uuid-123", "nama_toko": "Warung Jaya" },
    "items": [
      { "barang_id": "uuid-456", "nama": "Minyak Goreng", "jumlah": 5, "subtotal": 50000 },
      { "barang_id": "uuid-789", "nama": "Gula", "jumlah": 2, "subtotal": 20000 }
    ],
    "total": 70000,
    "status": "draft",
    "invoice": {
      "invoice_id": "uuid-inv-1",
      "nomor_invoice": "INV-2026-001",
      "total": 70000,
      "status": "belum"
    },
    "created_at": "2026-06-27T10:30:00Z"
  }
}
```

---

## 🔐 Authentication & Authorization

**Bearer Token (JWT):**
```
Header: Authorization: Bearer eyJhbGc...
Token payload: { user_id, email, role, exp }
```

**Role-Based Access:**
```
Lapangan:    [POST /konsumen, GET /orders]
Gudang:      [POST /stok/masuk, GET /stok/history]
Admin:       [POST /orders, POST /invoices, PUT /barang/harga, POST /pengiriman]
Management:  [GET all endpoints, POST /dashboard/report]
```

---

## 📊 Error Handling

**Standard Error Response:**
```json
{
  "error": {
    "code": "STOK_TIDAK_CUKUP",
    "message": "Stok minyak goreng hanya tersisa 2 pcs",
    "statusCode": 400,
    "field": "barang_id"
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` (400) — Input invalid
- `UNAUTHORIZED` (401) — Missing/invalid token
- `FORBIDDEN` (403) — No permission
- `NOT_FOUND` (404) — Resource tidak ada
- `STOK_TIDAK_CUKUP` (422) — Inventory issue
- `DUPLICATE_KONTAK_WA` (409) — Unique constraint
- `INTERNAL_ERROR` (500) — Server error

---

## 🔄 Pagination & Filtering

**List Endpoint Query:**
```
GET /api/v1/orders?page=1&limit=20&status=confirmed&date=2026-06-27
GET /api/v1/konsumen?page=1&limit=50&search=warung&kota=jakarta

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## 🔗 External Integrations

### **Google Maps API**
```
POST /api/v1/routes/optimize
Input: [{ lat, long, konsumen_id }...]
Output: Optimized route sequence
```

### **Twilio WhatsApp**
```
POST /api/v1/broadcast/send
Input: [phone_numbers], message_template
Output: Delivery status
```

### **Payment Gateway** (Optional)
```
POST /api/v1/invoices/:id/payment/link
Output: Payment link for online payment
```

---

## ✅ Checklist

- [ ] All endpoints defined
- [ ] Request/response formats clear
- [ ] Error codes documented
- [ ] Authentication method specified
- [ ] Authorization rules per role
- [ ] Pagination strategy defined
- [ ] External API integrations documented

---

**Status:** Ready for Frontend UI Design  
**Next:** → 03-UI-Breakdown.md
