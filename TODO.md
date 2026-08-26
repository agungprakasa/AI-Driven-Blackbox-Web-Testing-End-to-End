# TODO — API Testing Workflow

## Fase 1 — Persiapan
- [ ] Masukkan curl/Postman collection ke `input/curl/` atau `input/postman/`
- [ ] Masukkan credentials ke `input/credential/` atau isi `config/api-config.env`
- [ ] Masukkan alpha test result ke `input/alpha-test/` (jika ada)
- [ ] Jalankan `python scripts/setup.sh` untuk validasi environment

## Fase 2 — Analisis & Perencanaan
- [ ] `docs/material-analysis.md` — analisis API endpoints
- [ ] `docs/api-map.md` — daftar semua endpoint, method, parameter
- [ ] `docs/test-strategy.md` — strategi testing API
- [ ] `docs/test-scenario.md` — skenario per endpoint
- [ ] `docs/test-case.md` — test case detail

## Fase 3 — Eksekusi
- [ ] Functional test (`tests/api/functional/`)
- [ ] Negative test (`tests/api/negative/`)
- [ ] Boundary test (`tests/api/boundary/`)
- [ ] Security test (`tests/api/security/`)
- [ ] E2E test (`tests/api/e2e/`)
- [ ] Simpan bukti ke `evidence/PASS|FAIL/`

## Fase 4 — Dokumentasi Temuan
- [ ] `docs/defect-list.md` — daftar bug
- [ ] `docs/security-findings.md` — temuan keamanan API
- [ ] `docs/evidence-validation.md` — validasi bukti

## Fase 5 — Pelaporan
- [ ] Susun laporan Excel → `reports/excel/`
- [ ] Susun laporan Word → `reports/docx/`
- [ ] Jalankan `python scripts/validate-report.py`
- [ ] `docs/final-summary.md` — ringkasan & rekomendasi
