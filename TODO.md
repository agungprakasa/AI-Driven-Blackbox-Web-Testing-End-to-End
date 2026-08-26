# TODO — QA Web Testing Workflow

## Fase 1 — Persiapan
- [ ] Kumpulkan BRD & materi ke `input/brd/`
- [ ] Salin template reporting ke `input/reporting-template/`
- [ ] Siapkan kredensial testing di `input/credential/`
- [ ] Buat `config/test-config.env` dari contoh
- [ ] Jalankan `scripts/setup.sh` dan `scripts/validate-environment.sh`

## Fase 2 — Analisis & Perencanaan
- [ ] `docs/material-analysis.md` — analisis BRD/materi
- [ ] `docs/application-map.md` — peta fitur/halaman/route aplikasi
- [ ] `docs/test-strategy.md` — scope, pendekatan, tools, risiko
- [ ] `docs/test-scenario.md` — skenario per modul
- [ ] `docs/test-case.md` — test case detail (ID, step, expected)

## Fase 3 — Eksekusi
- [ ] Functional test (`tests/web/functional/`)
- [ ] Boundary test (`tests/web/boundary/`)
- [ ] Abnormal/negative test (`tests/web/abnormal/`)
- [ ] Exploratory test (`tests/web/exploratory/`)
- [ ] Security test (`tests/web/security/`)
- [ ] E2E test (`tests/web/e2e/`)
- [ ] Simpan semua bukti ke `evidence/PASS|FAIL/`

## Fase 4 — Dokumentasi Temuan
- [ ] `docs/exploratory-findings.md`
- [ ] `docs/security-findings.md`
- [ ] `docs/defect-list.md` — daftar bug dengan severity/priority
- [ ] `docs/evidence-validation.md` — verifikasi bukti lengkap & valid

## Fase 5 — Pelaporan
- [ ] Generate laporan Playwright → `reports/playwright/`
- [ ] Susun laporan Excel → `reports/excel/`
- [ ] Susun laporan Word → `reports/docx/`
- [ ] Jalankan `python scripts/validate-report.py`
- [ ] `docs/final-summary.md` — ringkasan akhir & rekomendasi go/no-go
