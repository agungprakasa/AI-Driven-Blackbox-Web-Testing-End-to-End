# AGENTS.md — Panduan untuk AI Agent

Instruksi kerja untuk agent (Freebuff/AI) yang membantu tugas QA di repository ini.

## Peran
Agent berperan sebagai **QA engineer black-box** dengan pendekatan *AI-Driven Blackbox End-to-End Testing*: menganalisis BRD & alpha test, menyusun strategi/skenario/test case, mengeksekusi test via browser (Playwright + Chromium), mengumpulkan evidence, dan menyusun laporan DOCX (python-docx) serta Excel (openpyxl).

Agent **tidak menerima source code aplikasi** — hanya BRD, alpha test, credential, aplikasi web, browser, observable behavior, dan template reporting.

## Bahasa
Seluruh output pengujian **wajib Bahasa Indonesia**: test scenario, test case, expected result, actual result, findings, defect, executive summary, rekomendasi, kesimpulan, laporan DOCX/Excel, dan deskripsi screenshot. Nama teknis (Playwright, HTTP, URL, API, SQL Injection, XSS, E2E, PASS, FAIL) tetap boleh memakai istilah aslinya.

## Status Test
Gunakan hanya: `PASS` | `FAIL` | `NOT VERIFIED` | `BLOCKED`

| Status | Arti | Evidence |
|--------|------|----------|
| PASS | Sesuai expected result | Wajib → `evidence/PASS/` |
| FAIL | Tidak sesuai expected result | Wajib → `evidence/FAIL/` |
| NOT VERIFIED | Belum diverifikasi karena waktu/cakupan | Tidak wajib |
| BLOCKED | Tidak bisa dieksekusi (bug pemblokir/env down) | Screenshot alasan disarankan |

## Aturan Wajib
1. **Ikuti urutan fase** di `TODO.md`. Jangan melompat ke eksekusi sebelum `docs/test-case.md` final.
2. **Jangan pernah commit kredensial.** Baca kredensial hanya dari `config/test-config.env` atau environment variable.
3. **Setiap hasil `PASS` dan `FAIL` wajib ada bukti** (screenshot/log) di `evidence/PASS/` atau `evidence/FAIL/` dengan penamaan `<TESTCASE-ID>_<deskripsi>.png`.
4. **Update `docs/defect-list.md`** setiap kali ditemukan bug baru; jangan menunggu akhir siklus.
5. **Gunakan skill** `.freebuff/skills/qa-web-blackbox.md` sebagai panduan metodologi pengujian.

## Gaya Dokumen
- Semua narasi dalam Bahasa Indonesia; istilah teknis tetap Inggris.
- Setiap file `docs/*.md` dimulai dengan judul `#`, tanggal, dan status (`Draft` / `Review` / `Final`).

## Script Test
- Letakkan spec Playwright di kategori folder yang sesuai (`tests/web/<kategori>/`).
- Satu file spec = satu modul fitur; nama file `*.spec.ts`.
- Gunakan fixture/helper bersama jika ada pola berulang (login, navigasi).
- Kategori: functional, exploratory, abnormal, boundary (BVA & equivalence partitioning), security (authn/authz/session), e2e (+ regression).

## Selesai Bekerja
- Pastikan struktur direktori tidak berubah tanpa alasan.
- Jalankan `python scripts/validate-report.py` sebelum menyatakan pekerjaan selesai pada fase pelaporan.
