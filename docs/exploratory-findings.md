# Exploratory Findings — Ipos5 (Courier Core System)

- **Tanggal:** 2026-08-26
- **Status:** Final
- **Metode:** Exploratory testing via Playwright (tanpa BRD)

## Ringkasan

| Metrik | Nilai |
|--------|-------|
| Total halaman diakses | 66 |
| Modul teridentifikasi | 8 |
| Temuan positif | Banyak halaman dapat diakses tanpa error |
| Temuan negatif | 1 defect (OTP validation) |

## Temuan Exploratory

### 1. Struktur Aplikasi
- Aplikasi menggunakan framework modern (React/Next.js + Tailwind CSS)
- SPA routing — navigasi antar halaman tanpa full page reload
- Sidebar navigation dengan grouping per modul
- Total 66 halaman/navigation items dari sidebar

### 2. Login & Autentikasi
- Form login: NIPPOS + Password + OTP
- NIPPOS adalah format Nomor Induk Pegawai Pos Indonesia (bukan email/username umum)
- OTP field ada tapi tidak divalidasi (lihat DEF-001)
- Session management menggunakan cookies/storage

### 3. Processing (Pengolahan Paket)
- 10 halaman terkait pengolahan paket
- Semua halaman dapat diakses setelah login
- Tidak ada tabel data yang terlihat (kemungkinan data kosong di environment dev)
- Form inputs tersedia di beberapa halaman

### 4. Collecting (Transaksi)
- 7 halaman terkait transaksi
- Halaman transaksi memiliki form input
- Backsheet dan rekap harian dapat diakses

### 5. Reporting (Pelaporan)
- 22 halaman — modul terbanyak
- Semua halaman dapat diakses tanpa error
- Beberapa halaman mungkin memerlukan data untuk menampilkan tabel

### 6. Settings (Pengaturan)
- 16 halaman manajemen sistem
- User, Role, Permission management tersedia
- Webhook dan Flow configuration tersedia

### 7. Observasi UI/UX
- Desain modern dengan Tailwind CSS
- Icon menggunakan Lucide icons
- Form inputs memiliki placeholder yang informatif
- Tidak ditemukan broken links di sidebar navigation

## Screenshot Eksplorasi
- `evidence/discover/01_halaman_login.png` — halaman login
- `evidence/discover/02_form_terisi.png` — form login terisi
- `evidence/discover/03_setelah_login.png` — halaman setelah login
- `evidence/discover/navigation.json` — data navigasi lengkap
