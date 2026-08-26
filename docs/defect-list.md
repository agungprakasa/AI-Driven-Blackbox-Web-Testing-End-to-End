# Defect List — Ipos5 (Courier Core System)

- **Tanggal:** 2026-08-26
- **Status:** Draft
- **Total defect:** 1

## Ringkasan per Severity
| Severity | Open | Fixed | Closed |
|----------|------|-------|--------|
| Critical | 0 | 0 | 0 |
| High     | 1 | 0 | 0 |
| Medium   | 0 | 0 | 0 |
| Low      | 0 | 0 | 0 |

## Definisi Severity
- **Critical:** blokir alur utama, kehilangan data, celah keamanan serius
- **High:** fungsi utama salah, tidak ada workaround
- **Medium:** fungsi menyimpang tapi ada workaround
- **Low:** kosmetik/minor, dampak kecil

---

## Daftar Defect
| ID | Judul | Modul | Severity | Priority | Test Case | Status | Bukti |
|----|-------|-------|----------|----------|-----------|--------|-------|
| DEF-001 | OTP tidak divalidasi — login berhasil meski OTP salah | Autentikasi | High | High | TC-AUTH-004 | Open | evidence/FAIL/TC-AUTH-004_login_gagal_otp_salah.png |

## Detail Defect

### DEF-001 — OTP tidak divalidasi — login berhasil meski OTP salah
- **Environment:** https://ipos-dev.posindonesia.co.id (Development), Chromium headless, 2026-08-26
- **Steps to Reproduce:**
  1. Buka https://ipos-dev.posindonesia.co.id/id/login
  2. Isi NIPPOS: 994492078
  3. Isi Password: $*Zemingho01
  4. Isi OTP: 999999 (OTP yang salah)
  5. Klik "Masuk"
- **Expected vs Actual:**
  - Expected: Login gagal; pesan error "OTP tidak valid" atau sejenisnya; tetap di halaman login
  - Actual: Login berhasil; URL berubah ke /dashboard/overview; user bisa mengakses seluruh fitur
- **Dampak:**
  - **Keamanan:** Lapisan keamanan MFA/OTP tidak berfungsi. Sistem hanya mengandalkan NIPPOS + Password tanpa verifikasi OTP yang ketat.
  - **Kepatuhan:** Jika aplikasi ini digunakan di lingkungan produksi, absennya validasi OTP melanggar standar keamanan dasar (OWASP — Multi-Factor Authentication).
  - **Risiko:** Akun bisa diakses oleh pihak yang mengetahui NIPPOS + Password tanpa perlu token OTP.
- **Rekomendasi:**
  1. **Immediate:** Implementasi validasi OTP di server-side; pastikan OTP diverifikasi sebelum session dibuat.
  2. **Short-term:** Tambahkan pesan error yang jelas jika OTP salah/kosong.
  3. **Long-term:** Audit seluruh alur autentikasi; pertimbangkan integrasi dengan sistem OTP yang lebih robust (SMS, TOTP, push notification).
- **Catatan developer/fix:** -

### DEF-000 (template) — <judul>
- **Environment:**
- **Steps to Reproduce:**
  1.
- **Expected vs Actual:**
- **Catatan developer/fix:**
