---
name: qa-web-blackbox
description: Metodologi AI-Driven Blackbox End-to-End Testing aplikasi web untuk template ini — analisis BRD/alpha test, strategi, skenario, eksekusi multi-kategori via Playwright + Chromium, dokumentasi bukti, dan pelaporan DOCX/Excel dalam Bahasa Indonesia. Gunakan setiap kali bekerja di repository freebuff-web-testing-template.
---

# Skill: QA Web Black-Box Testing

## Kapan Digunakan
Aktifkan skill ini saat diminta: menganalisis BRD & alpha test, menyusun strategi/skenario/test case, menulis/menjalankan test web, atau menyusun laporan QA di template ini.

## Prinsip
1. **Black-box:** agent tidak menerima source code aplikasi; uji dari perspektif pengguna menggunakan observable behavior di browser.
2. **Evidence-first:** tanpa bukti, hasil test tidak sah.
3. **Traceability:** setiap test case harus bisa dilacak ke requirement (BRD).
4. **Bahasa Indonesia:** seluruh output pengujian wajib Bahasa Indonesia; nama teknis (Playwright, HTTP, URL, API, SQL Injection, XSS, E2E, PASS, FAIL) tetap boleh asli.

## Alur Kerja (ikuti urutan TODO.md)
1. **Analisis** — baca `input/brd/`, tulis `docs/material-analysis.md` dan `docs/application-map.md`.
2. **Rencana** — susun `docs/test-strategy.md` → `docs/test-scenario.md` → `docs/test-case.md`. Gunakan format ID `TC-<MODUL>-<NNN>`, `SC-<MODUL>-<NNN>`, `DEF-<NNN>`.
3. **Eksekusi per kategori** dengan urutan prioritas:
   - `functional` — verifikasi requirement utama (positive, negative, normal testing).
   - `boundary` — Boundary Value Analysis & Equivalence Partitioning pada field input (min/max/panjang/format/tanggal).
   - `abnormal` — input salah/kosong, karakter spesial, interupsi (refresh/back saat submit), error handling.
   - `exploratory` — session-based charters 60 menit, catat ke `docs/exploratory-findings.md`.
   - `security` — authentication testing, authorization testing (IDOR, privilege escalation), session testing (timeout, logout), cek dasar OWASP Top 10 (XSS, SQL Injection); catat ke `docs/security-findings.md`.
   - `e2e` — journey utama pengguna end-to-end + regression testing pada area yang terdampak perubahan.
4. **Dokumentasi temuan** — update `docs/defect-list.md` real-time, lalu `docs/evidence-validation.md`.
5. **Laporan** — generate laporan Excel dengan openpyxl ke `reports/excel/` (matrix hasil) → laporan Word dengan python-docx ke `reports/docx/` (naratif) → jalankan `python scripts/validate-report.py`.

## Teknis Eksekusi
- Tool utama: **Playwright (TypeScript)** dengan browser **Chromium**. Spec di `tests/web/<kategori>/*.spec.ts`.
- Konfigurasi dari `config/test-config.env`; jangan hardcode URL/kredensial.
- Screenshot otomatis on failure + screenshot bukti untuk hasil Pass.
- Simpan bukti: `evidence/PASS/<TC-ID>_<deskripsi>.png` atau `evidence/FAIL/...`.

## Status & Severity
- Status test (gunakan hanya ini): `PASS | FAIL | NOT VERIFIED | BLOCKED`
  - `PASS` / `FAIL` → bukti wajib di `evidence/PASS/` atau `evidence/FAIL/`.
  - `NOT VERIFIED` → belum diverifikasi karena waktu/cakupan; bukti tidak wajib.
  - `BLOCKED` → tidak bisa dieksekusi (bug pemblokir/env down); screenshot alasan disarankan.
- Severity defect: Critical (blokir alur/data/keamanan serius) > High > Medium > Low.

## Definisi Selesai
- Exit criteria `docs/test-strategy.md` terpenuhi.
- `scripts/validate-report.py` keluar dengan status sukses.
- `docs/final-summary.md` memuat rekomendasi go/no-go.
