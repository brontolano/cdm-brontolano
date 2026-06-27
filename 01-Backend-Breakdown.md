# Consumer Data Manager — Backend Breakdown

**Status:** 📝 Planning  
**Owner:** Backend Developer  
**Deadline:** 3 Juli 2026

---

## 🏗️ Architecture Context

| Item | Value |
|------|-------|
| **Stack** | Node.js + Express + PostgreSQL |
| **Auth** | JWT + Role-based access control (RBAC) |
| **Database** | PostgreSQL (relational, good for transactions) |
| **External APIs** | Google Maps (GPS), Twilio (WhatsApp), Payment gateway |
| **Caching** | Redis (optional, for optimization) |

---

## 📊 Database Schema

### **1. Users Table**
```sql
users:
  - id (UUID, PK)
  - email (String, Unique, Required)
  - password_hash (String)
  - nama_lengkap (String)
  - role (Enum: lapangan, gudang, admin, management)
  - status (Enum: active, inactive)
  - created_at (Timestamp)
  - updated_at (Timestamp)
```

**Relationships:**
- One User → Many konsumen (if lapangan creates konsumen)
- One User → Many orders (if admin creates orders)

---

### **2. Konsumen Table** (Data Konsumen)
```sql
konsumen:
  - id (UUID, PK)
  - nama_toko (String, Required, 1-100 chars)
  - nama_pemilik (String, Required)
  - kontak_wa (String, Required, Unique, Format: +62...)
  - alamat_lengkap (String, Required)
  - latitude (Float)
  - longitude (Float)
  - kota (String)
  - status (Enum: aktif, tidak_aktif)
  - created_by (UUID, FK → users)
  - created_at (Timestamp)
  - updated_at (Timestamp)
```

**Validation Rules:**
- nama_toko: required, unique per city (optional), 1-100 chars
- kontak_wa: must be valid WhatsApp number, unique
- alamat_lengkap: required, min 10 chars
- latitude/longitude: valid GPS coordinates

**Indexes:**
- `idx_kontak_wa` (fast lookup for messaging)
- `idx_status_city` (for filtering)
- `idx_location` (for map queries)

---

### **3. Barang (Inventory Items) Table**
```sql
barang:
  - id (UUID, PK)
  - nama_barang (String, Required)
  - kategori (String)
  - hpp (Decimal, Required) — Harga Pokok Penjualan
  - harga_jual (Decimal, Required)
  - stok_saat_ini (Integer, Default: 0)
  - stok_minimum (Integer, Default: 5)
  - unit (String: pcs, dus, kg, liter, dll)
  - created_at (Timestamp)
  - updated_at (Timestamp)
```

**Validation Rules:**
- harga_jual > hpp (margin check)
- stok >= 0
- nama_barang unique

---

### **4. Order Table**
```sql
orders:
  - id (UUID, PK)
  - nomor_order (String, Unique) — Auto-generated: ORD-2026-001
  - konsumen_id (UUID, FK)
  - total_harga (Decimal)
  - status (Enum: draft, confirmed, proses, dikirim, selesai, dibatalkan)
  - tanggal_order (Date)
  - catatan (Text)
  - created_at (Timestamp)
  - updated_at (Timestamp)
```

**Relationships:**
- Many-to-One with konsumen
- One-to-Many with order_items
- One-to-One with invoice
- One-to-One with pengiriman

---

### **5. Order Items Table** (Line items dalam order)
```sql
order_items:
  - id (UUID, PK)
  - order_id (UUID, FK)
  - barang_id (UUID, FK)
  - jumlah (Integer, Required)
  - harga_satuan (Decimal)
  - subtotal (Decimal)
  - created_at (Timestamp)
```

---

### **6. Invoice Table**
```sql
invoices:
  - id (UUID, PK)
  - nomor_invoice (String, Unique) — Auto: INV-2026-001
  - order_id (UUID, FK)
  - total (Decimal)
  - status_pembayaran (Enum: belum, sebagian, lunas)
  - tanggal_invoice (Date)
  - tanggal_jatuh_tempo (Date)
  - created_at (Timestamp)
```

---

### **7. Stok History Table** (Audit trail untuk inventory)
```sql
stok_history:
  - id (UUID, PK)
  - barang_id (UUID, FK)
  - tipe (Enum: masuk, keluar)
  - jumlah (Integer)
  - keterangan (String) — e.g., "Order #123", "Restock"
  - created_by (UUID, FK → users)
  - created_at (Timestamp)
```

---

### **8. Pengiriman (Delivery) Table**
```sql
pengiriman:
  - id (UUID, PK)
  - order_id (UUID, FK)
  - rute (JSON) — Array of konsumen_ids in delivery sequence
  - driver_assignment (String)
  - status (Enum: planning, in_transit, completed, delayed)
  - tanggal_pengiriman (Date)
  - estimated_completion (DateTime)
  - actual_completion (DateTime)
  - created_at (Timestamp)
```

---

## 🔐 Business Logic & Validation

### **Feature 1: Manage Konsumen**

**Create Konsumen:**
```
Input: nama_toko, nama_pemilik, kontak_wa, alamat, GPS
Validation:
  - nama_toko required, 1-100 chars
  - kontak_wa valid WhatsApp format & unique
  - alamat min 10 chars
  - GPS coordinates valid (lat -90-90, long -180-180)
Processing:
  1. Validate input
  2. Create record
  3. Allow optional GPS lookup (geocoding)
Output: Created konsumen with ID
Errors:
  - Duplicate kontak_wa: "Nomor WA sudah terdaftar"
  - Invalid format: "Format tidak valid"
```

### **Feature 2: Order Management**

**Create Order:**
```
Input: konsumen_id, barang_items[], catatan
Validation:
  - konsumen_id exists
  - barang_items not empty
  - Each barang_id exists
  - jumlah > 0 dan <= stok_tersedia
Processing:
  1. Validate input
  2. Check stok availability
  3. Calculate total (qty × harga_jual)
  4. Create order record
  5. Create order_items
  6. Auto-generate invoice
  7. Reserve stok (optional: tentative reservation)
Output: Created order with invoice
Errors:
  - Stok kurang: "Stok tidak cukup untuk [barang]"
  - Konsumen tidak ditemukan
```

**Confirm Order:**
```
Input: order_id
Processing:
  1. Change status → confirmed
  2. Deduct stok (final deduction)
  3. Create stok_history entries
  4. Update invoice status → issued
Output: Confirmed order
```

### **Feature 3: Invoice Management**

**Auto-generate Invoice:**
```
Trigger: When order created
Processing:
  1. Generate nomor_invoice (INV-YYYY-001, incremental)
  2. Set tanggal_jatuh_tempo (default: +7 days)
  3. Status → belum (pending)
Output: Invoice record
```

**Record Payment:**
```
Input: invoice_id, jumlah_pembayaran
Processing:
  1. Add to pembayaran_record
  2. Update status_pembayaran:
     - Jika jumlah = total → lunas
     - Jika 0 < jumlah < total → sebagian
     - Jika jumlah = 0 → belum
Output: Updated invoice
```

### **Feature 4: Inventory Management**

**Input Barang Masuk:**
```
Input: barang_id, jumlah, keterangan
Processing:
  1. Validate input
  2. Add to stok_saat_ini
  3. Create stok_history (tipe: masuk)
  4. Notify if exceed max stok
Output: Updated stok + history
```

**Process Stok Keluar (dari order):**
```
Trigger: Order confirmed
Processing:
  1. For each order_item:
     a. Deduct stok_saat_ini
     b. Create stok_history (tipe: keluar)
  2. Alert if below stok_minimum
Output: Updated stok + history
```

### **Feature 5: Pengiriman & Rute**

**Create Delivery Route:**
```
Input: order_ids[]
Processing:
  1. Get konsumen GPS dari orders
  2. Call Google Maps API
  3. Calculate optimal route (TSP algorithm)
  4. Create pengiriman record dengan rute
  5. Assign to driver
Output: Delivery route dengan sequence
```

**Update Delivery Status:**
```
Input: pengiriman_id, status, lokasi_saat_ini
Processing:
  1. Update status
  2. Log lokasi & timestamp
  3. If completed → update order status
  4. Send notification ke admin
Output: Updated pengiriman
```

---

## 🔔 Notifications & Events

| Event | Action |
|-------|--------|
| **Order Created** | Send notification ke gudang (ada order baru) |
| **Order Confirmed** | Send notification ke driver (siap dikirim) |
| **Stok Below Minimum** | Alert admin (perlu restock) |
| **Pengiriman Selesai** | Mark order as delivered, update invoice |
| **Pembayaran Diterima** | Update invoice status |

---

## 🔐 Authorization Rules

| Role | Permission |
|------|-----------|
| **Lapangan** | Create/Edit konsumen, View orders |
| **Gudang** | Create stok_masuk, View stok, View orders |
| **Admin** | Create order, Create invoice, Manage pengiriman, Set harga |
| **Management** | View all, Generate reports, View analytics |

---

## 📈 Performance Considerations

**Indexes for Common Queries:**
- `idx_konsumen_status_city` (list konsumen filter)
- `idx_orders_status_date` (list orders by status)
- `idx_stok_history_barang_date` (audit trail)
- `idx_pengiriman_status_date` (delivery tracking)

**Query Optimization:**
- Use pagination (20-50 items per page)
- Cache konsumen list (15 min TTL)
- Cache harga barang (1 hour TTL)
- Use database indexes for filtering

---

## 🚨 Error Handling

| Scenario | Response |
|----------|----------|
| Stok tidak cukup | "Stok [barang] hanya tersisa [n]" |
| Konsumen tidak ditemukan | "Konsumen tidak ditemukan" |
| Duplicate kontak_wa | "Nomor WA sudah terdaftar" |
| GPS invalid | "Koordinat GPS tidak valid" |
| Database error | "Terjadi kesalahan. Hubungi admin." |

---

## 🧪 Testing Strategy

**Unit Tests:**
- [ ] Validate input (nomor WA format, stok check, etc)
- [ ] Calculate totals (order, invoice)
- [ ] Stok deduction logic
- [ ] Authorization (role-based)

**Integration Tests:**
- [ ] Create order → auto-generate invoice
- [ ] Confirm order → deduct stok
- [ ] Pengiriman creation → route generation
- [ ] Payment → update invoice status

**Edge Cases:**
- [ ] Stok = 0, order masuk
- [ ] Duplicate kontak_wa on update
- [ ] Large order (many items)
- [ ] Concurrent orders

---

## ✅ Checklist

Before moving to API design:

- [ ] All 8 tables defined with relationships
- [ ] Business logic rules clearly stated
- [ ] Validation rules for all inputs
- [ ] Error scenarios documented
- [ ] Authorization rules defined
- [ ] Performance indexes planned
- [ ] Notification events identified

---

**Status:** Ready for API Design Phase  
**Next:** → 02-API-Breakdown.md
