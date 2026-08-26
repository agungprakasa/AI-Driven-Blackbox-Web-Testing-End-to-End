# Material Analysis — Ipos5 (Courier Core System)

- **Tanggal:** 2026-08-26
- **Status:** Final
- **Metode:** Exploratory Testing via Playwright (tanpa BRD)

## 1. Ringkasan Aplikasi

- **Nama:** Courier Core System - Pos Indonesia
- **URL:** https://ipos-dev.posindonesia.co.id
- **Environment:** Development (ipos-dev)
- **Deskripsi:** Sistem pengelolaan kurir/ekspedisi untuk PT Pos Indonesia — mencakup penerimaan paket, bagging, manifest, pengiriman, pelacakan, collecting/transaksi, reporting, dan pengaturan sistem.

## 2. Halaman Login

- **URL:** `https://ipos-dev.posindonesia.co.id/id/login`
- **Field:**
  - NIPPOS (text) — Nomor Induk Pegawai Pos Indonesia
  - Password (password)
  - OTP (text, 6 digit) — One-Time Password
- **Tombol:** "Masuk" (submit)
- **Framework:** React/Next.js dengan Tailwind CSS (data-slot attributes terdeteksi)

## 3. Akun Test

| NIPPOS | Password | OTP | Keterangan |
|--------|----------|-----|------------|
| 994492078 | $*Zemingho01 | 111111 | Akun regular — login berhasil |

## 4. Modul Aplikasi (dari Sidebar Navigation)

### 4.1 Dashboard
- Overview — halaman utama setelah login
- Webhook — konfigurasi webhook

### 4.2 Processing (Pengolahan Paket)
- Receiving — penerimaan paket
- Bagging — proses bagging paket
- Manifest R7 — manifest pengiriman
- Hand Over — serah terima paket
- Unbagging — pembukaan bag
- Bags — daftar bag
- Manifests — daftar manifest
- Loading — proses loading paket ke kendaraan
- Unloading — proses unloading paket dari kendaraan
- Irregularity — ketidakberesan/kerusakan paket

### 4.3 Collecting (Pengumpulan/Transaksi)
- Beranda — beranda collecting
- Transaksi — menu transaksi
- Daftar Transaksi — daftar semua transaksi
- Backsheet — backsheet transaksi
- Rekap Harian — rekapitulasi harian
- Audit Koreksi — audit dan koreksi transaksi
- Pembatalan — pembatalan transaksi

### 4.4 Referencing (Referensi Tarif)
- Hitung Tarif — kalkulasi tarif pengiriman

### 4.5 Reporting (Pelaporan)
- Daftar Paket — laporan daftar paket
- Daftar Bag — laporan daftar bag
- Tracking: Bag, Bag Item, Tracking Events, Tracking Events Raw
- Daftar Kedatangan — laporan kedatangan paket
- Daftar Angkutan — laporan angkutan
- Operational: Loading, Loading Bag, Unloading, Unloading Bag, Receiving
- Manifest R7 — laporan manifest
- Tools: Unbagging, Unbagging Item, Pre-Bagging, Manifest R7, Irregularity
- Komisi Agenpos — laporan komisi agenpos
- Laporan Keuangan — laporan keuangan

### 4.6 Modules (Modul Tambahan)
- Irregularity — modul ketidakberesan
- COD Recon — rekonsiliasi COD (Cash On Delivery)

### 4.7 Settings (Pengaturan)
- User — manajemen pengguna
- Team — manajemen tim
- Location — manajemen lokasi
- Role — manajemen role
- Permission — manajemen hak akses
- Webhook — konfigurasi webhook
- Flow — konfigurasi alur kerja
- Data — manajemen data
- Billing — penagihan
- Packaging — manajemen kemasan
- Location Type — tipe lokasi
- Location Group — grup lokasi
- Customization — kustomisasi
- Transport Mode — mode transportasi
- Custom Field — field kustom
- Product Formula — formula produk (warehouse)

### 4.8 Account (Akun)
- Profile — profil pengguna
- Password — ubah password
- API Key — manajemen API key
- MFA — Multi-Factor Authentication

## 5. Temuan Mendalam

### Login
- Form login menggunakan NIPPOS (bukan username umum)
- OTP diperlukan — kemungkinan auto-generate atau dari aplikasi token
- Framework modern (React/Next.js + Tailwind CSS)
- **DEF-001:** OTP tidak divalidasi — login berhasil meski OTP salah

### Processing (Pengolahan Paket)
- **Receiving:** Input "Scan atau ketik nomor R7" + tombol "Konfirmasi R7" (disabled sampai ada input R7)
  - Penerimaan paket dilakukan dengan scan/ input nomor R7, bukan form manual
  - Tombol konfirmasi hanya aktif setelah nomor R7 diinput
- **Bagging:** Input untuk scan/select bag + tombol "Muat Draf"
- **Manifest:** Input "Cari kantor tujuan" + "Pilih driver" + tombol "Buat Manifest R7"
- **Hand Over:** Tombol "Konfirmasi R7" (disabled tanpa data)
- **Loading:** Tab/filter "Pending", "Scanned", "Berangkat"
- Semua halaman processing belum ada data (environment dev kosong)

### Collecting (Transaksi)
- **Beranda:** Hanya search bar "Find page..." — tidak ada form transaksi langsung
- **Transaksi:** Hanya search bar — form transaksi tidak terlihat di halaman ini
- **Daftar Transaksi:** Tabel kosong (0 data)
- **Rekap Harian:** Tabel kosong (0 data)
- **Kesimpulan:** Transaksi di Collecting kemungkinan dibuat melalui alur Receiving (scan R7), bukan form manual di halaman Collecting

### Reporting (Pelaporan)
- **Daftar Paket:** 25 data paket tersedia dengan kolom lengkap:
  - `connote_code` (nomor resi): format 40000178773792401
  - `transaction_id` (UUID)
  - Pengirim: Ahmad Sender, 081234567890
  - Penerima: Budi Receiver, 081987654321
  - Service: Regular, Harga: Rp 20.000
- **Daftar Bag:** 25 data bag dengan status:
  - BAG_RECEIVED, BAG_FINALIZED, BAG_IN_TRANSIT
  - Bag numbers: PID985AD2392, PID490A0A276, dll
- **Tracking:** 6 input filter (text, date, number) — tidak ada search by resi langsung
- **Tracking Events:** Tabel event tracking tersedia

### Navigasi
- Sidebar navigation dengan grouping per modul
- 66 halaman/navigation items terdeteksi
- Beberapa link mengarah ke domain eksternal (expossandbox.mile.app)

### Alur Aplikasi
```
Receiving (scan R7) → Bagging → Manifest R7 → Hand Over → Loading → Unloading
     ↓                                                              ↓
Reporting/Paket (connote_code) ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
     ↓
Tracking (bag, bag-item, events)
```

### Limitasi Explorasi
- Form transaksi Collecting tidak terlihat — kemungkinan melalui alur Receiving
- Environment dev memiliki data test (25 paket, 25 bag)
- Beberapa halaman memerlukan data R7 yang valid untuk aktivasi tombol
- Filter inputs tidak memiliki placeholder yang deskriptif (kecuali Tracking Events: "Enter connote code...")
- 6 halaman Reporting memiliki tombol Export untuk download data

## 6. Fitur Filter & Download (Hasil Eksplorasi Lengkap)

### Reporting — Filter & Export
| Halaman | Filter Inputs | Export | Keterangan |
|---------|---------------|--------|------------|
| Daftar Paket | 10 (text, date, number, select) | ✅ Export | Filter: nomor resi, tanggal, service, status |
| Daftar Bag | 10 (text, date, number, select) | ✅ Export | Filter: nomor bag, tanggal, status |
| Tracking Bag | 10 (text, date, number, select) | ❌ | Filter: nomor bag, tanggal, status |
| Tracking Bag Item | 10 (text, date, number, select) | ❌ | Filter: nomor bag item, tanggal |
| Tracking Events | 2 (text, connote code) | ❌ | Search by connote code |
| Daftar Kedatangan | 10 (text, date, number, select) | ✅ Export | Filter: tanggal kedatangan, asal |
| Daftar Angkutan | 10 (text, date, number, select) | ❌ | Filter: tanggal, rute |
| Loading | 10 (text, date, number, select) | ✅ Export | Filter: tanggal, status |
| Laporan Keuangan | 10 (text, date, number, select) | ✅ Export | Filter: tanggal, jenis transaksi |
| Komisi Agenpos | 10 (text, date, number, select) | ✅ Export | Filter: tanggal, agen |
| Manifest R7 | 10 (text, date, number, select) | ❌ | Filter: tanggal, tujuan |
| Tools (5 halaman) | 10 masing-masing | ❌ | Unbagging, Pre-Bagging, dll |

### Processing — Filter
| Halaman | Filter/Button | Keterangan |
|---------|---------------|------------|
| Receiving | Scan R7 input | Input nomor R7, tombol Konfirmasi R7 (disabled) |
| Bagging | Muat Draf, Pilih kantor tujuan | Dropdown kantor tujuan |
| Manifest | Checkbox | Pilih paket untuk manifest |
| Loading | Tab: Pending/Scanned/Berangkat | Filter berdasarkan status |
| Unloading | Find page search | Pencarian sederhana |

### Collecting — Filter
| Halaman | Filter Input | Keterangan |
|---------|-------------|------------|
| Daftar Transaksi | Date, Cari nomor resi, Cari, Segarkan | Filter tanggal & nomor resi |
| Backsheet | Find page search | Pencarian sederhana |
| Rekap Harian | Cari nomor rekap (search) | Pencarian by nomor rekap |
| Audit Koreksi | Cari No. Resi / Kode Booking | Pencarian by resi/booking |
| Pembatalan | Masukkan Nomor Resi | Pencarian by nomor resi |

### Settings — Filter
| Halaman | Filter | Keterangan |
|---------|--------|------------|
| User | Find page search | Pencarian sederhana |
| Role | Find page search | Pencarian sederhana |
| Location | Find page search | Pencarian sederhana |
| Permission | Find page search | Pencarian sederhana |

### Referencing — Hitung Tarif
| Field | Tipe | Keterangan |
|-------|------|------------|
| Customer | Select + Pilih customer | Pilih jenis customer |
| Kode Pos Asal | Pilih kode pos asal | Lokasi pengiriman |
| Kode Pos Tujuan | Pilih kode pos tujuan | Lokasi penerimaan |
| Berat (gram) | Number (default 1000) | Berat paket |
| Panjang, Lebar, Tinggi | Number | Dimensi paket |
| Asuransi | Number | Nilai asuransi |
| Tombol | Hitung Tarif | Hitung total biaya |

### Summary — Export/Download
| Halaman | Tombol Export |
|---------|---------------|
| Daftar Paket | ✅ Export |
| Daftar Bag | ✅ Export |
| Daftar Kedatangan | ✅ Export |
| Loading | ✅ Export |
| Laporan Keuangan | ✅ Export |
| Komisi Agenpos | ✅ Export |
| **Total** | **6 halaman dengan Export** |

---

## 7. Rekomendasi Testing

### Prioritas Tinggi
1. **Authentication** — login NIPPOS+Password+OTP, session handling
2. **Processing** — alur penerimaan → bagging → manifest → hand over
3. **Collecting** — transaksi, rekap harian, audit
4. **Reporting** — laporan paket, bag, tracking, keuangan

### Prioritas Menengah
5. **Settings** — manajemen user, role, permission
6. **Tracking** — pelacakan paket real-time
7. **COD Recon** — rekonsiliasi pembayaran COD

### Prioritas Rendah
8. **Customization** — fitur kustomisasi
9. **API Key** — manajemen API
10. **MFA** — setup multi-factor authentication
