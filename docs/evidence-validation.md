# Evidence Validation — Ipos5 (Courier Core System)

- **Tanggal:** 2026-08-26
- **Status:** Final
- **Metode verifikasi:** Inventarisasi folder `evidence/` + cross-check dengan test-case.md

## Aturan Validasi
1. Setiap test case berstatus `PASS`/`FAIL` harus punya bukti di `evidence/PASS/` atau `evidence/FAIL/`.
2. Status `NOT VERIFIED` dan `BLOCKED` tidak wajib bukti.
3. Penamaan bukti: `<TC-ID>_<deskripsi>.png`.

## Hasil Rekapitulasi

| Metrik | Nilai |
|--------|-------|
| Total test case | 66 |
| PASS (dengan bukti) | 65 |
| FAIL (dengan bukti) | 1 |
| NOT VERIFIED | 0 |
| BLOCKED | 0 |
| Bukti lengkap sesuai konvensi | ✅ semua |

## Matriks Validasi

### Modul AUTH (10 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-AUTH-001 | PASS | evidence/PASS/TC-AUTH-001_login_berhasil.png | ✅ |
| TC-AUTH-002 | PASS | evidence/PASS/TC-AUTH-002_login_gagal_nippos_kosong.png | ✅ |
| TC-AUTH-003 | PASS | evidence/PASS/TC-AUTH-003_login_gagal_password_salah.png | ✅ |
| TC-AUTH-004 | **FAIL** | ⚠️ evidence/FAIL/TC-AUTH-004_login_gagal_otp_salah.png | ✅ |
| TC-AUTH-005 | PASS | evidence/PASS/TC-AUTH-005_login_gagal_semua_kosong.png | ✅ |
| TC-AUTH-006 | PASS | evidence/PASS/TC-AUTH-006_login_nippos_tidak_terdaftar.png | ✅ |
| TC-AUTH-007 | PASS | evidence/PASS/TC-AUTH-007_session_aktif.png | ✅ |
| TC-AUTH-008 | PASS | evidence/PASS/TC-AUTH-008_aset_halaman_internal.png | ✅ |
| TC-AUTH-009 | PASS | evidence/PASS/TC-AUTH-009_reload_session_aktif.png | ✅ |
| TC-AUTH-010 | PASS | evidence/PASS/TC-AUTH-010_tab1.png, TC-AUTH-010_tab2.png | ✅ |

### Modul PROC (12 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-PROC-001 | PASS | evidence/PASS/TC-PROC-001_receiving_halamana.png | ✅ |
| TC-PROC-002 | PASS | evidence/PASS/TC-PROC-002_receiving_elemen.png | ✅ |
| TC-PROC-003 | PASS | evidence/PASS/TC-PROC-003_bagging_halaman.png | ✅ |
| TC-PROC-004 | PASS | evidence/PASS/TC-PROC-004_bagging_elemen.png | ✅ |
| TC-PROC-005 | PASS | evidence/PASS/TC-PROC-005_manifest_halaman.png | ✅ |
| TC-PROC-006 | PASS | evidence/PASS/TC-PROC-006_manifest_elemen.png | ✅ |
| TC-PROC-007 | PASS | evidence/PASS/TC-PROC-007_handover_halaman.png | ✅ |
| TC-PROC-008 | PASS | evidence/PASS/TC-PROC-008_handover_elemen.png | ✅ |
| TC-PROC-009 | PASS | evidence/PASS/TC-PROC-009_unbagging_halaman.png | ✅ |
| TC-PROC-010 | PASS | evidence/PASS/TC-PROC-010_loading_halaman.png | ✅ |
| TC-PROC-011 | PASS | evidence/PASS/TC-PROC-011_unloading_halaman.png | ✅ |
| TC-PROC-012 | PASS | evidence/PASS/TC-PROC-012_irregularity_halaman.png | ✅ |

### Modul COLL (8 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-COLL-001 | PASS | evidence/PASS/TC-COLL-001_beranda_collecting.png | ✅ |
| TC-COLL-002 | PASS | evidence/PASS/TC-COLL-002_transaksi_baru.png | ✅ |
| TC-COLL-003 | PASS | evidence/PASS/TC-COLL-003_daftar_transaksi.png | ✅ |
| TC-COLL-004 | PASS | evidence/PASS/TC-COLL-004_backsheet.png | ✅ |
| TC-COLL-005 | PASS | evidence/PASS/TC-COLL-005_rekap_harian.png | ✅ |
| TC-COLL-006 | PASS | evidence/PASS/TC-COLL-006_audit_koreksi.png | ✅ |
| TC-COLL-007 | PASS | evidence/PASS/TC-COLL-007_pembatalan.png | ✅ |
| TC-COLL-008 | PASS | evidence/PASS/TC-COLL-008_hitung_tarif.png | ✅ |

### Modul REPO (10 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-REPO-001 | PASS | evidence/PASS/TC-REPO-001_daftar_paket.png | ✅ |
| TC-REPO-002 | PASS | evidence/PASS/TC-REPO-002_daftar_bag.png | ✅ |
| TC-REPO-003 | PASS | evidence/PASS/TC-REPO-003_tracking_bag.png | ✅ |
| TC-REPO-004 | PASS | evidence/PASS/TC-REPO-004_tracking_bag_item.png | ✅ |
| TC-REPO-005 | PASS | evidence/PASS/TC-REPO-005_tracking_events.png | ✅ |
| TC-REPO-006 | PASS | evidence/PASS/TC-REPO-006_daftar_kedatangan.png | ✅ |
| TC-REPO-007 | PASS | evidence/PASS/TC-REPO-007_daftar_angkutan.png | ✅ |
| TC-REPO-008 | PASS | evidence/PASS/TC-REPO-008_laporan_loading.png | ✅ |
| TC-REPO-009 | PASS | evidence/PASS/TC-REPO-009_laporan_komisi.png | ✅ |
| TC-REPO-010 | PASS | evidence/PASS/TC-REPO-010_laporan_keuangan.png | ✅ |

### Modul TRCK (4 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-TRCK-001 | PASS | evidence/PASS/TC-TRCK-001_cari_paket.png | ✅ |
| TC-TRCK-002 | PASS | evidence/PASS/TC-TRCK-002_history_tracking.png | ✅ |
| TC-TRCK-003 | PASS | evidence/PASS/TC-TRCK-003_paket_tidak_ditemukan.png | ✅ |
| TC-TRCK-004 | PASS | evidence/PASS/TC-TRCK-004_filter_tanggal.png | ✅ |

### Modul SETT (10 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-SETT-001 | PASS | evidence/PASS/TC-SETT-001_daftar_user.png | ✅ |
| TC-SETT-002 | PASS | evidence/PASS/TC-SETT-002_tambah_user.png | ✅ |
| TC-SETT-003 | PASS | evidence/PASS/TC-SETT-003_edit_user.png | ✅ |
| TC-SETT-004 | PASS | evidence/PASS/TC-SETT-004_hapus_user.png | ✅ |
| TC-SETT-005 | PASS | evidence/PASS/TC-SETT-005_manajemen_role.png | ✅ |
| TC-SETT-006 | PASS | evidence/PASS/TC-SETT-006_manajemen_permission.png | ✅ |
| TC-SETT-007 | PASS | evidence/PASS/TC-SETT-007_manajemen_lokasi.png | ✅ |
| TC-SETT-008 | PASS | evidence/PASS/TC-SETT-008_manajemen_tim.png | ✅ |
| TC-SETT-009 | PASS | evidence/PASS/TC-SETT-009_konfigurasi_webhook.png | ✅ |
| TC-SETT-010 | PASS | evidence/PASS/TC-SETT-010_konfigurasi_flow.png | ✅ |

### Modul MODL (2 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-MODL-001 | PASS | evidence/PASS/TC-MODL-001_irregularity.png | ✅ |
| TC-MODL-002 | PASS | evidence/PASS/TC-MODL-002_cod_recon.png | ✅ |

### Modul ACCT (4 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-ACCT-001 | PASS | evidence/PASS/TC-ACCT-001_profil_pengguna.png | ✅ |
| TC-ACCT-002 | PASS | evidence/PASS/TC-ACCT-002_ubah_password.png | ✅ |
| TC-ACCT-003 | PASS | evidence/PASS/TC-ACCT-003_api_key.png | ✅ |
| TC-ACCT-004 | PASS | evidence/PASS/TC-ACCT-004_setup_mfa.png | ✅ |

### Modul DASH (2 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-DASH-001 | PASS | evidence/PASS/TC-DASH-001_overview.png | ✅ |
| TC-DASH-002 | PASS | evidence/PASS/TC-DASH-002_webhook.png | ✅ |

### Modul E2E (4 TC)
| TC ID | Status | File Bukti | Ada |
|-------|--------|------------|-----|
| TC-E2E-001 | PASS | evidence/PASS/TC-E2E-001_01_receiving.png s.d. TC-E2E-001_06_unloading.png | ✅ |
| TC-E2E-002 | PASS | evidence/PASS/TC-E2E-002_01_transaksi.png s.d. TC-E2E-002_04_laporan_keuangan.png | ✅ |
| TC-E2E-003 | PASS | evidence/PASS/TC-E2E-003_01_tracking_bag.png s.d. TC-E2E-003_03_tracking_events.png | ✅ |
| TC-E2E-004 | PASS | evidence/PASS/TC-E2E-004_01_user_management.png s.d. TC-E2E-004_04_team_management.png | ✅ |

## Hasil Akhir
- Total test case dieksekusi: **66**
- Dengan bukti lengkap: **66** (65 PASS + 1 FAIL)
- Tanpa bukti (wajib diperbaiki): **0**

**Kesimpulan: KELENGKAPAN BUKTI TERPENUHI** — siap masuk fase pelaporan.
