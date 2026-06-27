# Consumer Data Manager — UI Breakdown

**Status:** 📝 Planning  
**Owner:** Frontend Developer  
**Deadline:** 5 Juli 2026

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| **Font Family** | Inter, Roboto |
| **Primary Color** | #ED1C24 (from Brontolano brand) |
| **Secondary** | #1A1A1A |
| **Neutral** | #F5F5F5, #CCCCCC, #666666 |
| **Status Colors** | Green #27AE60, Red #E74C3C, Yellow #F39C12, Blue #3498DB |
| **Border Radius** | 8px (standard), 12px (large) |
| **Spacing Unit** | 8px (multiples: 8, 16, 24, 32) |

---

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| **Mobile** | < 640px | Single column, stacked |
| **Tablet** | 640px - 1024px | Two column layout |
| **Desktop** | > 1024px | Full layout with sidebar |

---

## 🏗️ Page Structure

### **Main Layout**
```
┌─────────────────────────────────────┐
│          TOP NAVBAR                 │ (Logo, user menu, notifications)
├──────────┬──────────────────────────┤
│          │                          │
│ SIDEBAR  │    MAIN CONTENT AREA     │
│ (nav)    │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

**Sidebar (Desktop only):**
- Dashboard
- Konsumen
- Orders
- Inventory
- Pengiriman
- Reports
- Settings

**Navbar:**
- Logo + Brand name
- Search (optional)
- Notifications bell
- User profile dropdown

---

## 📋 Key Pages & Components

### **1. Dashboard Page**
**Purpose:** Overview & quick access

**Components:**
- Summary cards (total konsumen, orders today, stok status)
- Recent orders (table with last 5)
- Quick actions (New order, New konsumen, Input barang)
- Omset chart (sales trend)
- Inventory alerts (stok minimum items)

**Responsive:**
- Mobile: Stacked cards, no chart
- Desktop: Full layout with chart

---

### **2. Konsumen Management Page**

**Subpages:**
- **List View** (GET /konsumen)
  - Table with columns: nama_toko, pemilik, kontak_wa, alamat, status
  - Search bar (by nama atau kontak)
  - Filter by status (aktif/tidak aktif)
  - Pagination (20 items/page)
  - Actions: View, Edit, Delete, Message

- **Create/Edit Form** (POST/PUT /konsumen)
  - Fields: nama_toko, nama_pemilik, kontak_wa, alamat, GPS map picker
  - Validation: Real-time error messages
  - Submit button + Cancel
  - Auto-save draft (optional)

- **Detail View** (GET /konsumen/:id)
  - Full konsumen info
  - Order history
  - Contact & location map
  - Quick action: New order, Send message

---

### **3. Order Management Page**

**Subpages:**
- **List View** (GET /orders)
  - Table: nomor_order, konsumen, total, status, tanggal
  - Filter by status (draft, confirmed, proses, dikirim, selesai)
  - Sort by tanggal (newest first)
  - Quick actions: View, Edit, Confirm, Cancel

- **Create Order Form** (POST /orders)
  - Select konsumen (dropdown with search)
  - Add items (dynamic table)
    - Select barang
    - Input jumlah
    - Auto-calculate subtotal
  - Total calculation (auto)
  - Catatan (text area)
  - Confirm button → creates invoice automatically

- **Order Detail View** (GET /orders/:id)
  - Order info + items table
  - Total & invoice details
  - Status timeline
  - Actions: Edit (if draft), Confirm, Cancel, Print invoice

---

### **4. Invoice Page**

**Subpages:**
- **List View** (GET /invoices)
  - Table: nomor_invoice, konsumen, total, status_pembayaran, tanggal
  - Filter by status (belum, sebagian, lunas)

- **Invoice Detail** (GET /invoices/:id)
  - Beautiful invoice template (print-ready)
  - Items detail
  - Payment status
  - Action: Record payment, Download PDF, Print

- **Payment Record** (POST /invoices/:id/payment)
  - Amount input
  - Payment date
  - Method (tunai, transfer, dll)
  - Auto-update status (belum → sebagian → lunas)

---

### **5. Inventory Page**

**Subpages:**
- **Stock List** (GET /barang)
  - Table: nama_barang, harga_jual, stok, status (ok/minimum/habis)
  - Color coding: Green (ok), Yellow (minimum), Red (habis)
  - Search by nama
  - Filter by kategori

- **Input Barang Masuk** (POST /stok/masuk)
  - Select barang
  - Input jumlah
  - Keterangan (teks)
  - Submit → auto-update stok

- **Manage Harga** (admin only)
  - Table: barang, hpp, harga_jual, margin%
  - Edit harga in-line
  - Save changes

- **Stok History** (GET /stok/history)
  - Timeline view of all movements
  - Filter by barang atau tanggal
  - Show: tipe (masuk/keluar), jumlah, keterangan, created_by

---

### **6. Pengiriman (Delivery) Page**

**Subpages:**
- **Delivery List** (GET /pengiriman)
  - Table: tanggal, status, route (visual), driver, actions
  - Filter by status (planning, in_transit, completed)
  - Quick view: How many konsumen in each route?

- **Create Delivery** (POST /pengiriman)
  - Select orders to deliver
  - Auto-generate route (shows map with sequence)
  - Assign driver
  - Create button

- **Delivery Tracking** (GET /pengiriman/:id)
  - Map view showing:
    - Current location (if driver updates)
    - Route (sequence of konsumen)
    - Konsumen locations
  - Konsumen list in delivery sequence
  - Status per konsumen (pending, visited, completed)
  - Driver contact

---

### **7. Broadcasting Page**

**Subpages:**
- **Send Message** (POST /broadcast/send)
  - Select konsumen (checkbox list with search)
  - Or select by: status, kota, all
  - Message template (dropdown)
  - Preview message
  - Send button

- **Message Templates**
  - Pre-built templates for common messages
  - Custom message support

- **Broadcast History** (GET /broadcast/status)
  - List of past broadcasts
  - Delivery status per message
  - Resend option

---

## 🎯 Component Library

### **Reusable Components**
- **Button** (primary, secondary, danger, disabled)
- **Input** (text, email, tel, number with validation)
- **Select** (dropdown with search)
- **Table** (with sort, filter, pagination)
- **Card** (for summary info)
- **Modal** (confirm, form)
- **Toast** (success, error, warning notifications)
- **Spinner** (loading indicator)
- **Badge** (status badges)
- **DateTime Picker** (date & time selection)
- **Map** (Google Maps integration)
- **Chart** (for omset visualization)

---

## 🔐 Role-Based Views

| Role | Visible Pages |
|------|---------------|
| **Lapangan** | Dashboard, Konsumen (view/create), Orders (view), Messages |
| **Gudang** | Dashboard, Inventory (view stok), Input barang masuk, Stok history |
| **Admin** | All pages (Dashboard, Konsumen, Orders, Invoices, Inventory, Pengiriman, Broadcast) |
| **Management** | Dashboard (full), Reports, Analytics |

---

## 📱 Mobile Considerations

**What works on mobile:**
- Dashboard (simplified)
- List views (single column, swipeable actions)
- Forms (large touch targets ≥ 44px)
- Map view (scrollable, zoomable)
- Notifications (toast at bottom)

**What doesn't:**
- Complex tables (use card view instead)
- Sidebar (use hamburger menu)
- Hover states (use tap instead)

---

## ♿ Accessibility

- [ ] All inputs have labels
- [ ] Color not only indicator (use icons too)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Error messages linked to fields
- [ ] Aria-labels where needed

---

## 📊 User Flows

### **New Order Workflow**
```
Dashboard → New Order button
  ↓
Select Konsumen (search or list)
  ↓
Add Items (select barang, qty)
  ↓
Review & Submit
  ↓
Order created + Invoice auto-generated
  ↓
Invoice shows in list
```

### **Delivery Workflow**
```
Orders List → Select multiple orders
  ↓
Create Delivery
  ↓
System generates optimal route
  ↓
Assign driver
  ↓
Map view for driver to follow
  ↓
Mark as delivered
```

---

## ✅ Checklist

- [ ] All pages designed & documented
- [ ] Component library defined
- [ ] Responsive layouts planned
- [ ] Accessibility considered
- [ ] Mobile version designed
- [ ] Role-based views clear
- [ ] User workflows documented

---

**Status:** Ready for Frontend Logic Design  
**Next:** → 04-Logic-Breakdown.md
