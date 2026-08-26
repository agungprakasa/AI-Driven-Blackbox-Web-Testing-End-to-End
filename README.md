# AI-Driven Blackbox Web Testing Template

Template standar untuk melakukan pengujian aplikasi web menggunakan:

- Freebuff
- Playwright
- Chromium
- Node.js
- Python
- python-docx
- openpyxl

Metode pengujian:

- Blackbox Testing
- Functional Testing
- Exploratory Testing
- Positive Testing
- Negative Testing
- Normal Testing
- Abnormal Testing
- Boundary Value Analysis
- Equivalence Partitioning
- Security Testing
- Authentication Testing
- Authorization Testing
- Session Testing
- E2E Testing
- Regression Testing

Seluruh hasil pengujian dan reporting menggunakan **Bahasa Indonesia**.

---

# 1. Tujuan

Repository ini merupakan template standar yang dapat digunakan berulang kali untuk menguji aplikasi web yang berbeda.

Ketika terdapat aplikasi baru, tester cukup:

1. Clone/copy template
2. Memasukkan bahan aplikasi
3. Mengisi konfigurasi
4. Menjalankan Freebuff
5. Mengikuti TODO
6. Agent melakukan testing
7. Agent mengumpulkan evidence
8. Agent membuat laporan DOCX
9. Agent membuat laporan Excel

Template ini dirancang agar proses pengujian antar aplikasi memiliki struktur dan standar yang konsisten.

---

# 2. Prinsip Utama

Pengujian dilakukan menggunakan pendekatan:

> **AI-Driven Blackbox End-to-End Testing**

Agent tidak diberikan source code aplikasi.

Agent hanya menggunakan:

- BRD
- Alpha Test
- Credential
- Aplikasi web
- Browser
- Observable behavior
- Template reporting

---

# 3. Bahasa Pengujian

## WAJIB

Seluruh output pengujian harus menggunakan:

> **Bahasa Indonesia**

Termasuk:

- Test Scenario
- Test Case
- Expected Result
- Actual Result
- Exploratory Finding
- Security Finding
- Defect
- Executive Summary
- Recommendation
- Kesimpulan
- DOCX
- Excel
- Screenshot description
- Final report

Nama teknis seperti berikut tetap boleh menggunakan istilah aslinya:

- Playwright
- HTTP
- URL
- API
- SQL Injection
- Cross-Site Scripting
- Browser
- E2E
- PASS
- FAIL

---

# 4. Status Test

Gunakan hanya:

```text
PASS
FAIL
NOT VERIFIED
BLOCKED
```

| Status | Arti | Evidence Wajib? |
|--------|------|-----------------|
| `PASS` | Hasil sesuai expected result | Ya → `evidence/PASS/` |
| `FAIL` | Hasil tidak sesuai expected result | Ya → `evidence/FAIL/` |
| `NOT VERIFIED` | Belum diverifikasi karena waktu/cakupan | Tidak wajib |
| `BLOCKED` | Tidak dapat dieksekusi (bug pemblokir, env down, dll) | Disarankan: screenshot alasan blokir |

---

# 5. Struktur Direktori

```
freebuff-web-testing-template/
├── input/                      # Materi masukan (jangan diubah isinya)
│   ├── alpha-test/             # Catatan / umpan balik alpha test
│   ├── brd/                    # Business Requirement Document
│   ├── credential/             # Kredensial environment testing (JANGAN di-commit)
│   └── reporting-template/     # Template laporan (docx/xlsx)
├── config/
│   └── test-config.example.env # Contoh konfigurasi; salin ke test-config.env
├── docs/                       # Artefak dokumen QA (urutan workflow)
├── tests/web/                  # Script test berdasarkan kategori
│   ├── functional/             # Functional & positive/negative testing
│   ├── exploratory/            # Charter & catatan exploratory testing
│   ├── abnormal/               # Abnormal / negative testing
│   ├── boundary/               # Boundary Value Analysis & Equivalence Partitioning
│   ├── security/               # AuthN, AuthZ, session, security testing
│   └── e2e/                    # End-to-end & regression testing
├── evidence/
│   ├── PASS/                   # Bukti screenshot/log test berstatus PASS
│   └── FAIL/                   # Bukti screenshot/log test berstatus FAIL
├── reports/                    # Laporan akhir
│   ├── docx/                   # Laporan Word (python-docx)
│   ├── excel/                  # Laporan Excel (openpyxl)
│   └── playwright/             # Output runner Playwright (HTML/trace)
├── scripts/                    # Skrip bantu setup & validasi
└── .freebuff/skills/           # Skill/instruksi khusus untuk AI agent
```

## Konvensi Penamaan

- Test Scenario: `SC-<MODUL>-<NNN>`
- Test Case: `TC-<MODUL>-<NNN>`
- Defect: `DEF-<NNN>`
- Bukti: `<TESTCASE-ID>_<deskripsi>.png`

---

# 6. Cara Pakai

1. **Setup environment**
   ```bash
   bash scripts/setup.sh
   ```
2. **Salin konfigurasi** `config/test-config.example.env` → `config/test-config.env`, isi nilai aktual.
3. **Validasi lingkungan**
   ```bash
   bash scripts/validate-environment.sh
   ```
4. **Kerjakan alur QA** mengikuti checklist di [TODO.md](TODO.md), mulai dari `docs/material-analysis.md`.
5. **Simpan bukti** setiap eksekusi ke `evidence/PASS` atau `evidence/FAIL`.
6. **Validasi kelengkapan report**
   ```bash
   python scripts/validate-report.py
   ```

---

# 7. Keamanan

- File di `input/credential/` dan `config/test-config.env` **tidak boleh** masuk repository (sudah di-ignore).
- Jangan hardcode kredensial di dalam script test; selalu baca dari env.

---

# 8. Panduan Agent

Instruksi lengkap untuk AI agent ada di:

- [AGENTS.md](AGENTS.md) — aturan kerja agent di repository ini
- [.freebuff/skills/qa-web-blackbox.md](.freebuff/skills/qa-web-blackbox.md) — skill metodologi pengujian black-box
