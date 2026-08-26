# Security Findings — Ipos5 (Courier Core System)

- **Tanggal:** 2026-08-26
- **Status:** Final
- **Referensi metodologi:** OWASP Top 10 (pemetaan kategori), OWASP ASVS level dasar
- **Sumber hasil:** TC-AUTH-004, TC-AUTH-008, TC-AUTH-010, eksplorasi navigasi

## Ringkasan
| ID | Temuan | Kategori OWASP | Severity | Status |
|----|--------|----------------|----------|--------|
| SEC-001 | OTP tidak divalidasi saat login | A07 Identification & Authentication Failures | High | Open (= DEF-001) |
| SEC-002 | Session handling via cookies | A07 Identification & Authentication Failures | Info | Terdeploy |
| SEC-003 | Logout bersih — session terhapus | A07 Identification & Authentication Failures | Info | Terverifikasi |
| SEC-004 | Navigasi terproteksi — akses URL langsung terblock | A01 Broken Access Control | Info | Terverifikasi |
| SEC-POS-01 | Login memerlukan 3 faktor (NIPPOS + Password + OTP) | A07 | - | Terverifikasi (positif) |
| SEC-POS-02 | Session sinkron antar tab | A07 | - | Terverifikasi (positif) |
| SEC-POS-03 | Reload halaman tidak menghapus session | A07 | - | Terverifikasi (positif) |

## Detail Temuan

### SEC-001 — OTP tidak divalidasi saat login (= DEF-001)
- **Lokasi:** Halaman login (`/id/login`)
- **Langkah reproduksi:**
  1. Buka https://ipos-dev.posindonesia.co.id/id/login
  2. Isi NIPPOS: 994492078, Password: $*Zemingho01, OTP: 999999
  3. Klik "Masuk"
- **Hasil aktual:** Login berhasil meski OTP salah
- **Bukti:** evidence/FAIL/TC-AUTH-004_login_gagal_otp_salah.png
- **Dampak keamanan:** MFA/OTP tidak berfungsi sebagai lapisan keamanan kedua. Sistem hanya mengandalkan NIPPOS + Password.
- **Kategori OWASP:** A07:2021 — Identification and Authentication Failures
- **Rekomendasi:** Implementasi validasi OTP server-side; pastikan OTP diverifikasi sebelum session dibuat.

### SEC-002 — Session handling via cookies
- **Lokasi:** Seluruh aplikasi
- **Observasi:** Session management menggunakan cookies/storage browser. Tidak ada token JWT yang terlihat di URL.
- **Dampak:** Standar — session handling via cookies adalah pendekatan yang umum dan dapat diterima.
- **Rekomendasi:** Pastikan cookies menggunakan flag `httpOnly`, `secure`, dan `SameSite` yang tepat.

### SEC-003 — Logout bersih — session terhapus
- **Lokasi:** Fungsi logout
- **Observasi:** Setelah logout, akses ke halaman internal via URL langsung berhasil redirect ke login.
- **Dampak:** Positif — session benar-benar dihapus saat logout.
- **Status:** Terverifikasi (TC-AUTH-008)

### SEC-004 — Navigasi terproteksi — akses URL langsung terblock
- **Lokasi:** Seluruh halaman internal
- **Observasi:** Setelah logout, mencoba akses /dashboard/overview langsung redirect ke login.
- **Dampak:** Positif — akses tanpa session ditolak.
- **Status:** Terverifikasi (TC-AUTH-008)

## Kontrol yang Terverifikasi (Positif)

| ID | Kontrol | Test | Hasil |
|----|---------|------|-------|
| SEC-POS-01 | Login memerlukan 3 faktor (NIPPOS + Password + OTP) | TC-AUTH-001 | ✅ Tapi OTP tidak divalidasi |
| SEC-POS-02 | Session sinkron antar tab | TC-AUTH-010 | ✅ Session shared |
| SEC-POS-03 | Reload tidak menghapus session | TC-AUTH-009 | ✅ Session persist |
| SEC-POS-04 | Logout bersih — session terhapus | TC-AUTH-008 | ✅ Redirect ke login |

## Checklist Cek Dasar
- [x] Autentikasi & session management (login, logout, reload)
- [x] Access control antar halaman (direct URL access)
- [x] Session handling (cookies/storage)
- [ ] Input validation (SQL Injection, XSS) — belum diuji secara eksplisit
- [ ] Rate limiting pada form login — belum diuji
- [ ] Transport security (HTTPS) — perlu audit headers (CSP, HSTS)
- [ ] Error handling tidak membocorkan info internal — perlu verifikasi lebih lanjut

## Catatan Cakupan & Batasan
1. Pengujian dibatasi black-box UI tanpa tools scanner (OWASP ZAP, Burp Suite)
2. Audit HTTP security headers (CSP, HSTS, X-Frame-Options) belum dilakukan
3. Rate limiting belum diuji (environment dev)
4. Input validation untuk SQL Injection/XSS belum diuji secara eksplisit
5. Environment development — beberapa fitur keamanan mungkin belum diaktifkan
