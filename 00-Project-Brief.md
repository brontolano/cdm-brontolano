# Consumer Data Manager — Project Brief

**Status:** 🟡 Planning  
**Start Date:** 27 Juni 2026  
**Target Completion:** 15 Juli 2026  
**Team Size:** 2 developers (1 backend, 1 frontend)  
**Sprint Duration:** 3 weeks

---

## 📋 Project Overview

Aplikasi pengelola data konsumen (warung, toko, grosir) yang terstruktur untuk membantu tim lapangan, gudang, dan admin dalam mengelola konsumen, inventory, order, dan pengiriman.

**Problem Statement:**
- Tim lapangan membutuhkan sistem untuk input & tracking data konsumen
- Tim gudang perlu catat barang masuk-keluar secara terstruktur
- Tim admin perlu tool untuk membuat order, invoice, dan manage harga
- Belum ada sistem rute pengiriman yang optimal

**Solution:**
Aplikasi all-in-one dengan role-based access untuk 4 team: lapangan, gudang, admin, dan management.

---

## 🎯 Key Features

### **1. Data Konsumen**
- [x] Input & manage data konsumen (nama toko, pemilik, kontak WA, alamat GPS)
- [x] List view dengan search & filter
- [x] Location mapping (GPS integration)

### **2. Broadcast WhatsApp**
- [x] Send bulk messages ke konsumen
- [x] Template messages
- [x] Delivery status tracking

### **3. Order & Invoice Management**
- [x] Create order from konsumen data
- [x] Auto-generate invoice/struk/bukti pembayaran
- [x] Order history & tracking

### **4. Omset Tracking (Buku Pencatat)**
- [x] Record daily sales
- [x] View omset by period (harian, mingguan, bulanan)
- [x] Simple analytics & charts

### **5. Inventory Management**
- [x] Track barang masuk-keluar
- [x] Manage stok per item
- [x] Manage harga (HPP & selling price)

### **6. Pengiriman & Rute**
- [x] Create delivery schedule
- [x] Auto-generate optimal route based on konsumen location
- [x] Track delivery status

---

## 👥 Team & Roles

| Role | Responsibilities | System Access |
|------|------------------|----------------|
| **Lapangan** | Input konsumen data | Create/Edit konsumen, View orders |
| **Gudang** | Catat barang masuk-keluar | Input inventory, Track stok |
| **Admin** | Manage order, harga, invoice | Full order mgmt, Pricing, Invoice creation |
| **Management** | Monitor & reporting | Analytics, Dashboard, Reports |

---

## 🔄 Business Workflow

```
1. TIM LAPANGAN
   └─ Input data konsumen (nama, kontak, alamat, GPS)
   
2. TIM ADMIN
   ├─ Manage pricing (HPP & selling price)
   └─ Create order based on konsumen request
   
3. TIM GUDANG
   ├─ Input barang masuk
   ├─ Track barang keluar saat order
   └─ Manage inventory
   
4. TIM ADMIN (Delivery)
   ├─ Create delivery schedule
   ├─ Generate route (auto-optimize by location)
   └─ Assign delivery to driver/team
   
5. TIM LAPANGAN (Delivery)
   ├─ Track delivery route
   ├─ Confirm delivery completion
   └─ Update order status
```

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + TypeScript |
| **Backend** | Node.js + Express |
| **Database** | PostgreSQL |
| **Maps** | Google Maps API (for GPS & routing) |
| **WhatsApp** | Twilio/WhatsApp Business API |
| **Deployment** | Vercel (Frontend), Railway/Heroku (Backend) |

---

## 📦 Core Data Models

### **Konsumen**
- id, nama_toko, nama_pemilik, kontak_wa, alamat, latitude, longitude, status, created_at

### **Barang (Inventory)**
- id, nama_barang, hpp, harga_jual, stok, kategori, created_at

### **Order**
- id, konsumen_id, barang_items[], total_harga, status, created_at, updated_at

### **Invoice**
- id, order_id, nomor_invoice, total, pembayaran_status, created_at

### **Stok History**
- id, barang_id, tipe (masuk/keluar), jumlah, keterangan, created_at

### **Pengiriman**
- id, order_id, rute, driver, status, estimated_arrival, completed_at

---

## 🎯 Success Criteria

**MVP (Minimum Viable Product) — Week 1-2:**
- ✅ Konsumen CRUD (Create, Read, Update, Delete)
- ✅ Basic order creation & invoicing
- ✅ Inventory tracking (masuk-keluar)
- ✅ Role-based login (lapangan, gudang, admin)

**Enhancement — Week 3:**
- ✅ WhatsApp broadcast integration
- ✅ Route optimization (basic)
- ✅ Omset tracking & simple analytics
- ✅ Deployment & testing

---

## 🚀 Phase Breakdown

| Phase | Duration | Focus | Owner |
|-------|----------|-------|-------|
| **Backend Setup** | 2-3 days | Database & APIs | Backend |
| **Frontend Setup** | 2-3 days | UI components & layout | Frontend |
| **Feature 1: Konsumen** | 2-3 days | CRUD & GPS mapping | Both |
| **Feature 2: Order & Invoice** | 2-3 days | Order mgmt & auto-generation | Both |
| **Feature 3: Inventory** | 2 days | Stok tracking | Backend + Admin |
| **Feature 4: WhatsApp & Route** | 2-3 days | Broadcast & routing | Backend |
| **Testing & Deployment** | 2 days | QA & go-live | Both |

**Total: ~3 weeks**

---

## 📊 Constraints & Assumptions

**Constraints:**
- Budget: Limited (using free tier APIs where possible)
- Timeline: 3 weeks to MVP
- Team: Only 2 developers
- MVP first, enhancement later

**Assumptions:**
- Internet connectivity available for team
- Google Maps API free tier sufficient
- WhatsApp Business API can be integrated
- PostgreSQL as database

---

## 🔗 Key Contacts

| Role | Name | Email |
|------|------|-------|
| Project Lead | [Name] | [Email] |
| Backend Dev | [Name] | [Email] |
| Frontend Dev | [Name] | [Email] |

---

## 📚 Next Steps

1. ✅ Approve project brief
2. → Create 5-bagian breakdown (Backend, API, UI, Logic, Integration)
3. → Set up development environment
4. → Start backend implementation (Week 1)
5. → Start frontend implementation (Week 1)
6. → Feature development (Week 2-3)
7. → Testing & deployment (Week 3)

---

**Last Updated:** 27 Juni 2026  
**Version:** 1.0
