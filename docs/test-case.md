# Test Case — Ipos5 (Courier Core System)

- **Tanggal:** 2026-08-26
- **Status:** Draft
- **Referensi:** [test-scenario.md](test-scenario.md), [test-strategy.md](test-strategy.md)

## Konvensi
- ID: `TC-<MODUL>-<NNN>` (turunan dari `SC-<MODUL>-<NNN>`)
- Status: `NOT VERIFIED` / `PASS` / `FAIL` / `BLOCKED`
- Bukti wajib untuk PASS/FAIL di `evidence/PASS|FAIL/<TC-ID>_<deskripsi>.png`
- Data akun & URL dari `config/test-config.env`

---

## Modul: AUTH — Autentikasi

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-AUTH-001 | Login berhasil NIPPOS+Password+OTP valid | Halaman login terbuka | 1. Buka https://ipos-dev.posindonesia.co.id/id/login<br>2. Isi NIPPOS: 994492078<br>3. Isi Password: $*Zemingho01<br>4. Isi OTP: 111111<br>5. Klik "Masuk" | Berhasil login; URL berubah ke /dashboard/overview; sidebar navigation muncul | High | PASS |
| TC-AUTH-002 | Login gagal — NIPPOS kosong | Halaman login terbuka | 1. Kosongkan field NIPPOS<br>2. Isi Password & OTP<br>3. Klik "Masuk" | Login gagal; pesan error muncul (NIPPOS wajib diisi); tetap di halaman login | High | PASS |
| TC-AUTH-003 | Login gagal — Password salah | Halaman login terbuka | 1. Isi NIPPOS: 994492078<br>2. Isi Password: password_salah<br>3. Isi OTP: 111111<br>4. Klik "Masuk" | Login gagal; pesan error "credentials tidak valid" atau sejenisnya; tidak membocorkan info internal | High | PASS |
| TC-AUTH-004 | Login gagal — OTP kosong/salah | Halaman login terbuka | 1. Isi NIPPOS & Password valid<br>2. Kosongkan OTP atau isi OTP salah (999999)<br>3. Klik "Masuk" | Login gagal; pesan error OTP tidak valid; tetap di halaman login | High | FAIL |
| TC-AUTH-005 | Login gagal — semua field kosong | Halaman login terbuka | 1. Klik "Masuk" tanpa mengisi apa pun | Pesan error muncul untuk setiap field yang kosong; tidak crash | Medium | PASS |
| TC-AUTH-006 | Login dengan NIPPOS tidak terdaftar | Halaman login terbuka | 1. Isi NIPPOS: 000000000<br>2. Isi Password & OTP<br>3. Klik "Masuk" | Login gagal; pesan error "user tidak ditemukan" atau sejenisnya | Medium | PASS |
| TC-AUTH-007 | Session timeout setelah tidak aktif | Sudah login, di dashboard | 1. Login berhasil<br>2. Tunggu 15-30 menit tanpa aktivitas<br>3. Coba navigasi ke halaman lain | Session expired; redirect ke halaman login; pesan session timeout | Medium | PASS |
| TC-AUTH-008 | Logout dan akses halaman internal via URL langsung | Sudah login | 1. Login berhasil<br>2. Klik logout<br>3. Ketik URL /dashboard/overview di browser | Akses ditolak; redirect ke halaman login; tidak bisa akses tanpa session | High | PASS |
| TC-AUTH-009 | Reload halaman setelah login — session tetap aktif | Sudah login di dashboard | 1. Login berhasil<br>2. Reload halaman (F5) | Tetap di dashboard; session tidak terputus; data tetap ada | Medium | PASS |
| TC-AUTH-010 | Multiple tab — session sinkron | Sudah login di tab 1 | 1. Login di tab 1<br>2. Buka tab baru, akses /dashboard<br>3. Logout di tab 1<br>4. Reload tab 2 | Tab 2 juga logout; session sinkron antar tab | Low | PASS |

---

## Modul: PROC — Processing (Pengolahan Paket)

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-PROC-001 | Receiving — terima paket baru, data lengkap | Sudah login | 1. Buka /processing/receiving<br>2. Klik tombol tambah/buat baru<br>3. Isi semua data paket (pengirim, penerima, berat, dimensi)<br>4. Submit | Paket berhasil diterima; muncul konfirmasi; data paket tersimpan di daftar | High | PASS |
| TC-PROC-002 | Receiving — terima paket, data tidak lengkap | Sudah login | 1. Buka /processing/receiving<br>2. Klik tambah baru<br>3. Kosongkan salah satu field wajib<br>4. Submit | Validasi error muncul; form tidak disubmit; field kosong ditandai | High | PASS |
| TC-PROC-003 | Bagging — masukkan paket ke bag | Sudah login; ada paket yang sudah diterima | 1. Buka /processing/bagging<br>2. Pilih paket yang akan di-bag<br>3. Pilih/buat bag<br>4. Konfirmasi | Paket berhasil dimasukkan ke bag; status paket berubah; bag bertambah isi | High | PASS |
| TC-PROC-004 | Bagging — bag sudah penuh | Sudah login; ada bag yang sudah penuh | 1. Buka /processing/bagging<br>2. Coba masukkan paket ke bag yang penuh | Sistem menolak atau peringatan bag penuh; tidak bisa tambah paket | Medium | PASS |
| TC-PROC-005 | Manifest R7 — buat manifest baru | Sudah login; ada paket/bag siap | 1. Buka /processing/manifest<br>2. Klik buat manifest baru<br>3. Pilih paket/bag yang akan dimanifest<br>4. Isi data manifest<br>5. Submit | Manifest berhasil dibuat; nomor manifest tergenerate; data tersimpan | High | PASS |
| TC-PROC-006 | Manifest R7 — manifest dengan data tidak valid | Sudah login | 1. Buka /processing/manifest<br>2. Coba buat manifest tanpa paket/bag<br>3. Atau isi field dengan data tidak valid | Validasi error; manifest tidak bisa dibuat | Medium | PASS |
| TC-PROC-007 | Hand Over — serah terima paket ke kurir | Sudah login; ada manifest siap | 1. Buka /processing/handover<br>2. Pilih manifest/paket yang akan diserahterimakan<br>3. Pilih kurir penerima<br>4. Konfirmasi hand over | Serah terima berhasil; status berubah; kurir menerima paket | High | PASS |
| TC-PROC-008 | Hand Over — paket tidak ditemukan | Sudah login | 1. Buka /processing/handover<br>2. Coba serah terima paket yang tidak ada di sistem | Sistem menolak; pesan paket tidak ditemukan | Medium | PASS |
| TC-PROC-009 | Unbagging — buka bag, verifikasi isi | Sudah login; ada bag terkirim | 1. Buka /processing/unbagging<br>2. Pilih bag yang akan dibuka<br>3. Verifikasi isi bag<br>4. Konfirmasi | Bag berhasil dibuka; daftar isi bag ditampilkan; status bag berubah | Medium | PASS |
| TC-PROC-010 | Loading — muat paket ke kendaraan | Sudah login; ada paket siap kirim | 1. Buka /processing/loading<br>2. Pilih paket yang akan dimuat<br>3. Pilih kendaraan<br>4. Konfirmasi loading | Paket berhasil dimuat; status berubah; data loading tersimpan | High | PASS |
| TC-PROC-011 | Unloading — bongkar paket dari kendaraan | Sudah login; ada paket terkirim | 1. Buka /processing/unloading<br>2. Pilih kendaraan<br>3. Pilih paket yang akan dibongkar<br>4. Konfirmasi | Paket berhasil dibongkar; status berubah | High | PASS |
| TC-PROC-012 | Irregularity — laporkan paket rusak/hilang | Sudah login; ada paket bermasalah | 1. Buka /processing/irregularity<br>2. Pilih paket yang bermasalah<br>3. Isi jenis irregularity (rusak/hilang)<br>4. Isi keterangan<br>5. Submit | Laporan irregularity tersimpan; status paket berubah | Medium | PASS |

---

## Modul: COLL — Collecting (Transaksi)

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-COLL-001 | Akses beranda collecting | Sudah login | 1. Buka /collecting | Halaman beranda collecting tampil; data ringkasan transaksi ada | Medium | PASS |
| TC-COLL-002 | Buat transaksi baru | Sudah login | 1. Buka /collecting/transaksi<br>2. Klik buat transaksi baru<br>3. Isi data transaksi<br>4. Submit | Transaksi berhasil dibuat; nomor transaksi tergenerate | High | PASS |
| TC-COLL-003 | Lihat daftar transaksi | Sudah login; ada transaksi | 1. Buka /collecting/daftar-transaksi | Daftar transaksi tampil; bisa filter/cari | High | PASS |
| TC-COLL-004 | Lihat backsheet transaksi | Sudah login; ada transaksi | 1. Buka /collecting/backsheet | Backsheet tampil dengan data transaksi | Medium | PASS |
| TC-COLL-005 | Lihat rekap harian | Sudah login; ada transaksi hari ini | 1. Buka /collecting/rekap-harian | Rekap harian tampil; total transaksi benar | High | PASS |
| TC-COLL-006 | Audit koreksi — koreksi transaksi | Sudah login; ada transaksi | 1. Buka /collecting/audit-koreksi<br>2. Pilih transaksi yang perlu dikoreksi<br>3. Ubah data<br>4. Simpan | Transaksi berhasil dikoreksi; log audit tersimpan | High | PASS |
| TC-COLL-007 | Pembatalan transaksi | Sudah login; ada transaksi aktif | 1. Buka /collecting/pembatalan<br>2. Pilih transaksi yang akan dibatalkan<br>3. Konfirmasi pembatalan | Transaksi berhasil dibatalkan; status berubah | Medium | PASS |
| TC-COLL-008 | Transaksi dengan nominal tidak valid | Sudah login | 1. Buka /collecting/transaksi<br>2. Isi nominal: -100 atau 0 atau sangat besar<br>3. Submit | Validasi error; transaksi tidak bisa dibuat dengan nominal tidak valid | Medium | PASS |

---

## Modul: REPO — Reporting (Pelaporan)

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-REPO-001 | Lihat daftar paket | Sudah login; ada data paket | 1. Buka /reporting/paket | Daftar paket tampil; bisa filter, search, export | High | PASS |
| TC-REPO-002 | Lihat daftar bag | Sudah login; ada data bag | 1. Buka /reporting/bag | Daftar bag tampil; info jumlah paket per bag | High | PASS |
| TC-REPO-003 | Tracking bag | Sudah login; ada bag terkirim | 1. Buka /reporting/tracking/bag<br>2. Cari bag berdasarkan nomor | Info tracking bag tampil; history perjalanan bag | High | PASS |
| TC-REPO-004 | Tracking bag item | Sudah login | 1. Buka /reporting/tracking/bag-item<br>2. Cari item | Info item dalam bag tampil | Medium | PASS |
| TC-REPO-005 | Tracking events | Sudah login | 1. Buka /reporting/tracking/tracking-events<br>2. Lihat event terbaru | Daftar event tracking tampil; timestamp benar | Medium | PASS |
| TC-REPO-006 | Lihat daftar kedatangan | Sudah login; ada paket kedatangan | 1. Buka /reporting/kedatangan | Daftar kedatangan tampil; data paket yang sampai | Medium | PASS |
| TC-REPO-007 | Lihat daftar angkutan | Sudah login; ada data angkutan | 1. Buka /reporting/angkutan | Daftar angkutan tampil; info kendaraan & rute | Medium | PASS |
| TC-REPO-008 | Laporan loading/unloading | Sudah login; ada data loading | 1. Buka /reporting/operational/loading<br>2. Buka /reporting/operational/unloading | Laporan loading & unloading tampil dengan data benar | Medium | PASS |
| TC-REPO-009 | Laporan komisi agenpos | Sudah login; ada transaksi agenpos | 1. Buka /reporting/komisi | Laporan komisi tampil; perhitungan benar | Medium | PASS |
| TC-REPO-010 | Laporan keuangan | Sudah login; ada data keuangan | 1. Buka /reporting/keuangan | Laporan keuangan tampil; total pemasukan/pengeluaran benar | High | PASS |

---

## Modul: TRCK — Tracking

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-TRCK-001 | Cari paket berdasarkan nomor resi | Sudah login; ada paket terkirim | 1. Buka halaman tracking<br>2. Masukkan nomor resi<br>3. Klik cari | Paket ditemukan; detail lokasi & status tampil | High | PASS |
| TC-TRCK-002 | Lihat history tracking paket | Sudah login; paket ditemukan | 1. Setelah paket ditemukan<br>2. Klik lihat history | History lengkap tampil: waktu, lokasi, status, aksi | High | PASS |
| TC-TRCK-003 | Cari paket tidak ditemukan | Sudah login | 1. Buka halaman tracking<br>2. Masukkan nomor resi palsu: 000000000<br>3. Klik cari | Pesan "paket tidak ditemukan"; tidak crash | Medium | PASS |
| TC-TRCK-004 | Filter tracking berdasarkan tanggal | Sudah login; ada data tracking | 1. Buka halaman tracking<br>2. Set filter tanggal awal & akhir<br>3. Terapkan filter | Hasil filter benar; hanya tampil data sesuai rentang tanggal | Medium | PASS |

---

## Modul: SETT — Settings (Pengaturan)

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-SETT-001 | Lihat daftar user | Sudah login, akses settings | 1. Buka /settings/user | Daftar user tampil; info role & status | High | PASS |
| TC-SETT-002 | Tambah user baru | Sudah login, akses settings | 1. Buka /settings/user<br>2. Klik tambah user<br>3. Isi data user (NIPPOS, nama, role)<br>4. Simpan | User baru berhasil ditambahkan; muncul di daftar | High | PASS |
| TC-SETT-003 | Edit user | Sudah login; ada user | 1. Buka /settings/user<br>2. Pilih user<br>3. Ubah data (nama/role)<br>4. Simpan | Data user berhasil diubah | Medium | PASS |
| TC-SETT-004 | Hapus user | Sudah login; ada user | 1. Buka /settings/user<br>2. Pilih user<br>3. Klik hapus<br>4. Konfirmasi | User berhasil dihapus; tidak muncul di daftar | Medium | PASS |
| TC-SETT-005 | Manajemen role — tambah/hapus role | Sudah login, akses settings | 1. Buka /settings/role<br>2. Tambah role baru<br>3. Set permission untuk role<br>4. Simpan<br>5. Hapus role | Role berhasil ditambah/dihapus | High | PASS |
| TC-SETT-006 | Manajemen permission — set hak akses | Sudah login, akses settings | 1. Buka /settings/permission<br>2. Pilih role<br>3. Ubah hak akses<br>4. Simpan | Permission berhasil diubah; user dengan role tersebut terdampak | High | PASS |
| TC-SETT-007 | Manajemen lokasi | Sudah login, akses settings | 1. Buka /settings/location<br>2. Tambah lokasi baru<br>3. Edit lokasi<br>4. Hapus lokasi | CRUD lokasi berhasil | Medium | PASS |
| TC-SETT-008 | Manajemen tim | Sudah login, akses settings | 1. Buka /settings/team<br>2. Tambah tim baru<br>3. Assign anggota<br>4. Simpan | Tim berhasil dibuat; anggota ter-assign | Medium | PASS |
| TC-SETT-009 | Konfigurasi webhook | Sudah login, akses settings | 1. Buka /settings/webhook<br>2. Tambah webhook baru<br>3. Isi URL & event<br>4. Simpan | Webhook tersimpan; bisa test koneksi | Low | PASS |
| TC-SETT-010 | Konfigurasi flow | Sudah login, akses settings | 1. Buka /settings/flow<br>2. Lihat flow yang ada<br>3. Ubah konfigurasi | Flow berhasil diubah | Low | PASS |

---

## Modul: MODL — Modules (Tambahan)

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-MODL-001 | Irregularity — laporkan ketidakberesan | Sudah login; ada paket bermasalah | 1. Buka /modules/irregularity<br>2. Laporkan paket bermasalah<br>3. Isi detail<br>4. Submit | Laporan irregularity tersimpan | Medium | PASS |
| TC-MODL-002 | COD Recon — rekonsiliasi COD | Sudah login; ada transaksi COD | 1. Buka /modules/cod-recon<br>2. Pilih transaksi COD<br>3. Rekonsiliasi<br>4. Konfirmasi | Rekonsiliasi berhasil; status COD berubah | Medium | PASS |

---

## Modul: ACCT — Account (Akun)

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-ACCT-001 | Lihat profil pengguna | Sudah login | 1. Buka /account | Profil tampil: NIPPOS, nama, role, lokasi | Low | PASS |
| TC-ACCT-002 | Ubah password | Sudah login | 1. Buka /account/password<br>2. Isi password lama<br>3. Isi password baru<br>4. Konfirmasi password baru<br>5. Simpan | Password berhasil diubah; login dengan password baru berhasil | Medium | PASS |
| TC-ACCT-003 | Manajemen API Key | Sudah login | 1. Buka /account/api-key<br>2. Buat API key baru<br>3. Copy API key<br>4. Hapus API key | API key berhasil dibuat & dihapus | Low | PASS |
| TC-ACCT-004 | Setup MFA | Sudah login | 1. Buka /account/mfa<br>2. Aktifkan MFA<br>3. Ikuti instruksi setup | MFA berhasil diaktifkan; login berikutnya memerlukan MFA | Low | PASS |

---

## Modul: DASH — Dashboard

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-DASH-001 | Lihat halaman overview | Sudah login | 1. Buka /dashboard/overview | Dashboard overview tampil; data ringkasan ada (grafik/angka) | Low | PASS |
| TC-DASH-002 | Lihat konfigurasi webhook | Sudah login | 1. Buka /dashboard/webhook | Daftar webhook tampil; status aktif/inaktif | Low | PASS |

---

## Modul: E2E — End-to-End Journey

| ID | Judul | Pre-condition | Steps | Expected Result | Priority | Status |
|----|-------|---------------|-------|-----------------|----------|--------|
| TC-E2E-001 | Journey lengkap: Login → Processing → Logout | Session baru | 1. Login NIPPOS+Password+OTP<br>2. Buka /processing/receiving<br>3. Terima paket baru<br>4. Buka /processing/bagging<br>5. Masukkan paket ke bag<br>6. Buka /processing/manifest<br>7. Buat manifest<br>8. Buka /processing/handover<br>9. Serah terima ke kurir<br>10. Logout | Seluruh alur processing berhasil; setiap langkah menampilkan hasil yang benar; logout bersih | High | PASS |
| TC-E2E-002 | Journey: Login → Transaksi → Rekap → Laporan | Session baru | 1. Login<br>2. Buka /collecting/transaksi<br>3. Buat transaksi baru<br>4. Buka /collecting/rekap-harian<br>5. Verifikasi rekap<br>6. Buka /reporting/keuangan<br>7. Verifikasi laporan<br>8. Logout | Transaksi tercatat di rekap harian; laporan keuangan sesuai | High | PASS |
| TC-E2E-003 | Journey: Login → Tracking → Detail | Session baru | 1. Login<br>2. Buka halaman tracking<br>3. Cari paket berdasarkan nomor resi<br>4. Lihat detail history tracking<br>5. Verifikasi lokasi & status terkini<br>6. Logout | Paket ditemukan; history lengkap; lokasi & status benar | Medium | PASS |
| TC-E2E-004 | Journey: Login → Settings → User Management | Session baru | 1. Login<br>2. Buka /settings/user<br>3. Tambah user baru<br>4. Buka /settings/role<br>5. Buat role baru<br>6. Set permission<br>7. Assign role ke user baru<br>8. Logout | User baru terbuat; role & permission terkonfigurasi | Medium | PASS |

---

## Ringkasan

| Modul | Jumlah TC | High | Medium | Low |
|-------|-----------|------|--------|-----|
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

Catatan: status awal seluruh TC = `NOT VERIFIED`. Update tabel ini setiap eksekusi; simpan bukti sesuai konvensi penamaan.
