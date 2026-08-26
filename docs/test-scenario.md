# Test Scenario — Ipos5 (Courier Core System)

- **Tanggal:** 2026-08-26
- **Status:** Final
- **Referensi:** [test-strategy.md](test-strategy.md), [application-map.md](application-map.md)

---

## Modul: AUTH — Autentikasi

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-AUTH-001 | Login berhasil dengan NIPPOS, Password, OTP valid | Functional | High |
| SC-AUTH-002 | Login gagal — NIPPOS kosong | Boundary | High |
| SC-AUTH-003 | Login gagal — Password salah | Negative | High |
| SC-AUTH-004 | Login gagal — OTP kosong/salah | Negative | High |
| SC-AUTH-005 | Login gagal — semua field kosong | Boundary | Medium |
| SC-AUTH-006 | Login dengan NIPPOS tidak terdaftar | Negative | Medium |
| SC-AUTH-007 | Session timeout setelah tidak aktif | Security | Medium |
| SC-AUTH-008 | Logout dan akses halaman internal via URL langsung | Security | High |
| SC-AUTH-009 | Reload halaman setelah login — session tetap aktif | Functional | Medium |
| SC-AUTH-010 | Multiple tab — session sinkron | Functional | Low |

---

## Modul: PROC — Processing (Pengolahan Paket)

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-PROC-001 | Receiving — terima paket baru, data lengkap | Functional | High |
| SC-PROC-002 | Receiving — terima paket, data tidak lengkap | Negative | High |
| SC-PROC-003 | Bagging — masukkan paket ke bag | Functional | High |
| SC-PROC-004 | Bagging — bag sudah penuh | Boundary | Medium |
| SC-PROC-005 | Manifest R7 — buat manifest baru | Functional | High |
| SC-PROC-006 | Manifest R7 — manifest dengan data tidak valid | Negative | Medium |
| SC-PROC-007 | Hand Over — serah terima paket ke kurir | Functional | High |
| SC-PROC-008 | Hand Over — paket tidak ditemukan | Negative | Medium |
| SC-PROC-009 | Unbagging — buka bag, verifikasi isi | Functional | Medium |
| SC-PROC-010 | Loading — muat paket ke kendaraan | Functional | High |
| SC-PROC-011 | Unloading — bongkar paket dari kendaraan | Functional | High |
| SC-PROC-012 | Irregularity — laporkan paket rusak/hilang | Functional | Medium |

---

## Modul: COLL — Collecting (Transaksi)

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-COLL-001 | Akses beranda collecting | Functional | Medium |
| SC-COLL-002 | Buat transaksi baru | Functional | High |
| SC-COLL-003 | Lihat daftar transaksi | Functional | High |
| SC-COLL-004 | Lihat backsheet transaksi | Functional | Medium |
| SC-COLL-005 | Lihat rekap harian | Functional | High |
| SC-COLL-006 | Audit koreksi — koreksi transaksi | Functional | High |
| SC-COLL-007 | Pembatalan transaksi | Functional | Medium |
| SC-COLL-008 | Transaksi dengan nominal tidak valid | Negative | Medium |

---

## Modul: REPO — Reporting (Pelaporan)

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-REPO-001 | Lihat daftar paket | Functional | High |
| SC-REPO-002 | Lihat daftar bag | Functional | High |
| SC-REPO-003 | Tracking bag | Functional | High |
| SC-REPO-004 | Tracking bag item | Functional | Medium |
| SC-REPO-005 | Tracking events | Functional | Medium |
| SC-REPO-006 | Lihat daftar kedatangan | Functional | Medium |
| SC-REPO-007 | Lihat daftar angkutan | Functional | Medium |
| SC-REPO-008 | Laporan loading/unloading | Functional | Medium |
| SC-REPO-009 | Laporan komisi agenpos | Functional | Medium |
| SC-REPO-010 | Laporan keuangan | Functional | High |

---

## Modul: TRCK — Tracking

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-TRCK-001 | Cari paket berdasarkan nomor resi | Functional | High |
| SC-TRCK-002 | Lihat history tracking paket | Functional | High |
| SC-TRCK-003 | Cari paket tidak ditemukan | Negative | Medium |
| SC-TRCK-004 | Filter tracking berdasarkan tanggal | Functional | Medium |

---

## Modul: SETT — Settings (Pengaturan)

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-SETT-001 | Lihat daftar user | Functional | High |
| SC-SETT-002 | Tambah user baru | Functional | High |
| SC-SETT-003 | Edit user | Functional | Medium |
| SC-SETT-004 | Hapus user | Functional | Medium |
| SC-SETT-005 | Manajemen role — tambah/hapus role | Functional | High |
| SC-SETT-006 | Manajemen permission — set hak akses | Functional | High |
| SC-SETT-007 | Manajemen lokasi | Functional | Medium |
| SC-SETT-008 | Manajemen tim | Functional | Medium |
| SC-SETT-009 | Konfigurasi webhook | Functional | Low |
| SC-SETT-010 | Konfigurasi flow | Functional | Low |

---

## Modul: MODL — Modules (Tambahan)

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-MODL-001 | Irregularity — laporkan ketidakberesan | Functional | Medium |
| SC-MODL-002 | COD Recon — rekonsiliasi COD | Functional | Medium |

---

## Modul: ACCT — Account (Akun)

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-ACCT-001 | Lihat profil pengguna | Functional | Low |
| SC-ACCT-002 | Ubah password | Functional | Medium |
| SC-ACCT-003 | Manajemen API Key | Functional | Low |
| SC-ACCT-004 | Setup MFA | Functional | Low |

---

## Modul: DASH — Dashboard

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-DASH-001 | Lihat halaman overview | Functional | Low |
| SC-DASH-002 | Lihat konfigurasi webhook | Functional | Low |

---

## Modul: E2E — End-to-End Journey

| ID | Skenario | Tipe | Prioritas |
|----|----------|------|-----------|
| SC-E2E-001 | Login → terima paket → bagging → manifest → hand over → logout | E2E | High |
| SC-E2E-002 | Login → buat transaksi → rekap harian → laporan keuangan → logout | E2E | High |
| SC-E2E-003 | Login → cari paket via tracking → lihat detail → logout | E2E | Medium |
| SC-E2E-004 | Login → manajemen user → set permission → logout | E2E | Medium |

---

## Ringkasan

| Modul | Jumlah Skenario | High | Medium | Low |
|-------|-----------------|------|--------|-----|
| AUTH | 10 | 4 | 5 | 1 |
| PROC | 12 | 6 | 6 | 0 |
| COLL | 8 | 3 | 5 | 0 |
| REPO | 10 | 4 | 6 | 0 |
| TRCK | 4 | 2 | 2 | 0 |
| SETT | 10 | 3 | 4 | 3 |
| MODL | 2 | 0 | 2 | 0 |
| ACCT | 4 | 0 | 1 | 3 |
| DASH | 2 | 0 | 0 | 2 |
| E2E | 4 | 2 | 2 | 0 |
| **Total** | **66** | **24** | **33** | **9** |
