# Application Map — Ipos5 (Courier Core System)

- **Tanggal:** 2026-08-26
- **Status:** Final
- **Metode:** Auto-discovery via Playwright

## Peta Halaman & Rute

### Login
| Path | Nama | Elemen | Auth |
|------|------|--------|------|
| `/id/login` | Halaman Login | NIPPOS field, Password field, OTP field, Masuk button | ❌ |

### Dashboard
| Path | Nama | Elemen | Auth |
|------|------|--------|------|
| `/dashboard` | Dashboard | Overview link, Webhook link | ✅ |
| `/dashboard/overview` | Overview | Dashboard utama, statistik | ✅ |
| `/dashboard/webhook` | Webhook | Konfigurasi webhook | ✅ |

### Processing (Pengolahan)
| Path | Nama | Elemen | Auth |
|------|------|--------|------|
| `/processing/receiving` | Receiving | Penerimaan paket | ✅ |
| `/processing/bagging` | Bagging | Proses bagging | ✅ |
| `/processing/manifest` | Manifest R7 | Manifest pengiriman | ✅ |
| `/processing/handover` | Hand Over | Serah terima | ✅ |
| `/processing/unbagging` | Unbagging | Pembukaan bag | ✅ |
| `/processing/bags` | Bags | Daftar bag | ✅ |
| `/processing/manifests` | Manifests | Daftar manifest | ✅ |
| `/processing/loading` | Loading | Loading ke kendaraan | ✅ |
| `/processing/unloading` | Unloading | Unloading dari kendaraan | ✅ |
| `/processing/irregularity` | Irregularity | Ketidakberesan | ✅ |

### Collecting (Transaksi)
| Path | Nama | Elemen | Auth |
|------|------|--------|------|
| `/collecting` | Beranda | Beranda collecting | ✅ |
| `/collecting/transaksi` | Transaksi | Menu transaksi | ✅ |
| `/collecting/daftar-transaksi` | Daftar Transaksi | Daftar semua transaksi | ✅ |
| `/collecting/backsheet` | Backsheet | Backsheet transaksi | ✅ |
| `/collecting/rekap-harian` | Rekap Harian | Rekapitulasi harian | ✅ |
| `/collecting/audit-koreksi` | Audit Koreksi | Audit & koreksi | ✅ |
| `/collecting/pembatalan` | Pembatalan | Pembatalan transaksi | ✅ |

### Referencing (Tarif)
| Path | Nama | Elemen | Auth |
|------|------|--------|------|
| `/referencing/tarif/calculate` | Hitung Tarif | Kalkulasi tarif | ✅ |

### Reporting (Pelaporan)
| Path | Nama | Elemen | Auth |
|------|------|--------|------|
| `/reporting/paket` | Daftar Paket | Laporan paket | ✅ |
| `/reporting/bag` | Daftar Bag | Laporan bag | ✅ |
| `/reporting/tracking/bag` | Bag Tracking | Pelacakan bag | ✅ |
| `/reporting/tracking/bag-item` | Bag Item | Item dalam bag | ✅ |
| `/reporting/tracking/tracking-events` | Tracking Events | Event pelacakan | ✅ |
| `/reporting/tracking/tracking-events-raw` | Tracking Events Raw | Event mentah | ✅ |
| `/reporting/kedatangan` | Daftar Kedatangan | Laporan kedatangan | ✅ |
| `/reporting/angkutan` | Daftar Angkutan | Laporan angkutan | ✅ |
| `/reporting/operational/loading` | Loading | Laporan loading | ✅ |
| `/reporting/operational/loading-bag` | Loading Bag | Laporan loading bag | ✅ |
| `/reporting/operational/unloading` | Unloading | Laporan unloading | ✅ |
| `/reporting/operational/unloading-bag` | Unloading Bag | Laporan unloading bag | ✅ |
| `/reporting/operational/receiving` | Receiving | Laporan receiving | ✅ |
| `/reporting/manifest` | Manifest R7 | Laporan manifest | ✅ |
| `/reporting/tools/unbagging` | Unbagging | Tools unbagging | ✅ |
| `/reporting/tools/unbagging-item` | Unbagging Item | Tools unbagging item | ✅ |
| `/reporting/tools/pre-bagging` | Pre-Bagging | Tools pre-bagging | ✅ |
| `/reporting/tools/manifest-r7` | Manifest R7 | Tools manifest | ✅ |
| `/reporting/tools/irregularity` | Irregularity | Tools irregularity | ✅ |
| `/reporting/komisi` | Komisi Agenpos | Laporan komisi | ✅ |
| `/reporting/keuangan` | Laporan Keuangan | Laporan keuangan | ✅ |

### Modules (Tambahan)
| Path | Nama | Elemen | Auth |
|------|------|--------|------|
| `/modules/irregularity` | Irregularity | Modul ketidakberesan | ✅ |
| `/modules/cod-recon` | COD Recon | Rekonsiliasi COD | ✅ |

### Settings (Pengaturan)
| Path | Nama | Elemen | Auth |
|------|------|--------|------|
| `/settings/user` | User | Manajemen pengguna | ✅ |
| `/settings/team` | Team | Manajemen tim | ✅ |
| `/settings/location` | Location | Manajemen lokasi | ✅ |
| `/settings/role` | Role | Manajemen role | ✅ |
| `/settings/permission` | Permission | Hak akses | ✅ |
| `/settings/webhook` | Webhook | Konfigurasi webhook | ✅ |
| `/settings/flow` | Flow | Alur kerja | ✅ |
| `/settings/data` | Data | Manajemen data | ✅ |
| `/settings/billing` | Billing | Penagihan | ✅ |
| `/settings/packaging` | Packaging | Kemasan | ✅ |
| `/settings/location-type` | Location Type | Tipe lokasi | ✅ |
| `/settings/location-group` | Location Group | Grup lokasi | ✅ |
| `/settings/customization` | Customization | Kustomisasi | ✅ |
| `/settings/transport-mode` | Transport Mode | Mode transportasi | ✅ |
| `/settings/custom-field` | Custom Field | Field kustom | ✅ |
| `/settings/warehouse/product-formula` | Product Formula | Formula produk | ✅ |

### Account (Akun)
| Path | Nama | Elemen | Auth |
|------|------|--------|------|
| `/account` | Profile | Profil pengguna | ✅ |
| `/account/password` | Password | Ubah password | ✅ |
| `/account/api-key` | API Key | Manajemen API | ✅ |
| `/account/mfa` | MFA | Multi-Factor Auth | ✅ |

## Ringkasan

| Modul | Jumlah Halaman | Contoh Halaman |
|-------|----------------|----------------|
| Dashboard | 2 | Overview, Webhook |
| Processing | 10 | Receiving, Bagging, Manifest, Loading |
| Collecting | 7 | Transaksi, Rekap Harian, Audit |
| Referencing | 1 | Hitung Tarif |
| Reporting | 22 | Daftar Paket, Tracking, Keuangan |
| Modules | 2 | Irregularity, COD Recon |
| Settings | 16 | User, Role, Permission, Flow |
| Account | 4 | Profile, Password, API Key, MFA |
| **Total** | **64** | |

## Catatan
- Aplikasi menggunakan SPA routing (React/Next.js)
- Beberapa halaman mungkin memerlukan role/permission tertentu
- Domain eksternal: expossandbox.mile.app (Package)
- Login memerlukan NIPPOS + Password + OTP
