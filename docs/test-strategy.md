# Test Strategy — Ipos5 (Courier Core System)

- **Tanggal:** 2026-08-26
- **Status:** Final
- **Aplikasi:** Courier Core System - Pos Indonesia (https://ipos-dev.posindonesia.co.id)

## 1. Pendekatan

AI-Driven Blackbox End-to-End Testing menggunakan Playwright + Chromium headless.

**Catatan:** Pengujian dilakukan tanpa BRD — seluruh strategi berdasarkan hasil exploratory testing dan observasi langsung terhadap aplikasi.

## 2. Lingkup Pengujian

| Jenis Pengujian | Aktif | Keterangan |
|-----------------|-------|------------|
| Functional Testing | ✅ | Verifikasi fungsi utama per modul |
| Boundary Value Analysis | ✅ | Input ekstrem: kosong, panjang maks, karakter spesial |
| Equivalence Partitioning | ✅ | Kelompok input valid vs tidak valid |
| Abnormal/Negative Testing | ✅ | Aksi tidak terduga, error handling |
| Exploratory Testing | ✅ | Eksplorasi bebas untuk temukan bug |
| Security Testing | ✅ | Auth, session, input validation, access control |
| E2E Testing | ✅ | Alur lengkap dari login sampai operasi inti |
| Regression Testing | ✅ | Verifikasi ulang setelah perbaikan defect |

## 3. Tools & Environment

| Komponen | Versi/Keterangan |
|----------|------------------|
| Playwright | TypeScript, latest |
| Browser | Chromium headless 1920x1080 |
| Node.js | v24.15.0 |
| Python | 3.13.9 (reporting) |
| python-docx | Laporan DOCX |
| openpyxl | Laporan Excel |
| OS | Windows (bash/Git Bash) |

## 4. Prioritas Modul

Berdasarkan dampak bisnis dan frekuensi penggunaan:

### Prioritas 1 — Kritis (Core Business)
| Modul | Alasan |
|-------|--------|
| **Authentication** | Gerbang utama akses sistem; jika gagal, seluruh sistem tidak bisa diakses |
| **Processing** | Alur inti pengolahan paket (receiving → bagging → manifest → hand over) |
| **Collecting** | Transaksi keuangan, rekap harian, audit — berdampak pada data keuangan |

### Prioritas 2 — Penting (Operasional)
| Modul | Alasan |
|-------|--------|
| **Reporting** | Laporan operasional dan keuangan; mendukung pengambilan keputusan |
| **Tracking** | Pelacakan paket real-time; krusial untuk layanan kurir |
| **Settings** | Manajemen user, role, permission — berdampak pada keamanan akses |

### Prioritas 3 — Pendukung
| Modul | Alasan |
|-------|--------|
| **Modules** | Irregularity, COD Recon — fitur tambahan |
| **Account** | Profil, password, API key, MFA |
| **Referencing** | Hitung tarif |
| **Dashboard** | Tampilan ringkasan |

## 5. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Aplikasi dev unstable | Test case gagal bukan karena bug | Jalankan 2-3x untuk konfirmasi; catat apakah error konsisten |
| Session timeout cepat | Test terputus di tengah alur | Setup fresh session per test; gunakan `storageState` |
| OTP berubah/expire | Login gagal | Gunakan OTP statis (111111) dari config |
| Data test tidak tersedia | Test case tidak bisa dijalankan | Buat data test sendiri atau gunakan data yang sudah ada |
| SPA routing timeout | Navigasi lambat | Set timeout lebih besar (15-30 detik per navigasi) |

## 6. Konvensi Penamaan

| Item | Format | Contoh |
|------|--------|--------|
| Test Case | `TC-<MODUL>-<NNN>` | TC-AUTH-001, TC-PROC-003 |
| Defect | `DEF-<NNN>` | DEF-001, DEF-002 |
| Bukti | `<TC-ID>_<deskripsi>.png` | TC-AUTH-001_login_sukses.png |
| Status | `PASS` / `FAIL` / `NOT VERIFIED` / `BLOCKED` | — |

## 7. Modul & Cakupan Test

| Modul ID | Nama | Fokus Testing |
|----------|------|---------------|
| AUTH | Autentikasi | Login NIPPOS+Password+OTP, session, logout |
| PROC | Processing | Receiving, bagging, manifest, hand over, loading |
| COLL | Collecting | Transaksi, rekap harian, audit koreksi, pembatalan |
| REPO | Reporting | Laporan paket, bag, tracking, keuangan |
| TRCK | Tracking | Pelacakan bag, item, events |
| SETT | Settings | User, role, permission, flow |
| MODL | Modules | Irregularity, COD Recon |
| ACCT | Account | Profile, password, API key, MFA |
| DASH | Dashboard | Overview, webhook |
| E2E | End-to-End | Alur lengkap login → operasi → logout |

## 8. Kriteria Keberhasilan

- **PASS:** Semua test case kritis (Priority High) PASS
- **GO dengan catatan:** Ada defect Medium/Low tapi tidak memblokir alur utama
- **NO-GO:** Ada defect Critical/High yang memblokir alur bisnis utama
