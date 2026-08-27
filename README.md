# AI-Driven API Testing — End-to-End

Template untuk pengujian REST API menggunakan pendekatan **AI-Driven Blackbox Testing**.

## Fitur

- ✅ Parse curl commands → auto-generate test spec
- ✅ API testing dengan Playwright (APIRequestContext)
- ✅ Support: Bearer Token, API Key, Basic Auth
- ✅ **Real Screenshot** — Bukti testing dengan screenshot nyata
- ✅ Laporan DOCX & Excel dengan evidence
- ✅ Validasi response status, body, schema
- ✅ Testing komprehensif: Positive, Negative, Boundary, Security, Performance, E2E

## API yang Diuji

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/test/1.0.0/getfeeLnDiscountNew` | POST | Hitung ongkos kirim dengan diskon |

**Base URL**: `http://10.29.41.37:8280`

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Jalankan semua test
npx playwright test tests/api/ --reporter=list

# 3. Generate screenshot (real API response)
node scripts/run-screenshots.js

# 4. Generate laporan
python scripts/generate-docx.py
python scripts/generate-excel.py

# 5. Validasi
python scripts/validate-report.py
```

## Input yang Diperlukan

### 1. Curl Commands
Simpan curl commands di `input/curl/endpoints.txt`:

```bash
# POST /test/1.0.0/getfeeLnDiscountNew
curl -X POST "http://10.29.41.37:8280/test/1.0.0/getfeeLnDiscountNew" \
  -H "Content-Type: application/json" \
  -d '{"customerid":"","desttypeid":"0","itemtypeid":"1","shipperzipcode":"10110","receiverzipcode":"MY","weight":1000,"length":0,"width":0,"height":0,"diameter":0,"valuegoods":7375}'
```

### 2. Credentials
Isi `config/api-config.env`:
```
API_BASE_URL=http://10.29.41.37:8280/test/1.0.0
AUTH_TYPE=none
```

## Struktur Test Cases

### 1. Positive/Functional Testing (`tests/api/functional/`)
- Request valid standar
- Berbagai tipe barang (itemtypeid)
- Berbagai destinasi (desttypeid)
- Domestic vs International shipping
- Dimensi paket
- Valuegoods berbeda

### 2. Negative/Abnormal Testing (`tests/api/negative/`)
- Body kosong
- Weight negatif/string
- Field hilang
- Invalid JSON
- Wrong HTTP method
- Extra fields

### 3. Boundary Value Testing (`tests/api/boundary/`)
- Weight: 0, 1, -1, 30000, 30001, MAX_INT
- Dimensi: 0x0x0, 1x1x1, -1x-1x-1, 100x100x100
- Valuegoods: 0, 1, -1, MAX_INT
- String: kosong, 1 char, 1000 char

### 4. Security Testing (`tests/api/security/`)
- SQL Injection
- XSS (Cross-Site Scripting)
- CRLF Injection
- Path Traversal
- XXE Attack
- Nested JSON (DoS)
- Information Disclosure

### 5. Performance Testing (`tests/api/e2e/`)
- Single request baseline
- Concurrent requests
- Sequential requests
- Response consistency
- Payload comparison

### 6. Data Validation Testing (`tests/api/functional/`)
- Response format (JSON)
- Field types (number, string)
- Currency positif
- Response consistency

### 7. Integration/E2E Testing (`tests/api/e2e/`)
- Full flow domestic
- Full flow international
- Heavy package
- Cylindrical package
- Sequential flow

## Hasil Testing

| Metrik | Nilai |
|--------|-------|
| Total Test Case | 92 |
| Tests Passed | 114 (Playwright) |
| Pass Rate | 78.3% |
| Screenshots | 15 (real API response) |
| Defects Found | 16 |

### Defect Summary

| Severity | Jumlah | Contoh |
|----------|--------|--------|
| Critical | 3 | SQL Injection crash, XSS crash |
| High | 10 | Tidak ada validasi input |
| Medium | 5 | Tidak ada validasi Content-Type |
| Low | 2 | X-Powered-By bocor |

## Struktur Direktori

```
├── config/
│   └── api-config.env           ← konfigurasi API
├── docs/
│   ├── test-case.md             ← 92 test cases
│   ├── defect-list.md           ← 16 defect
│   ├── material-analysis.md     ← analisis endpoint
│   ├── api-map.md               ← daftar endpoint
│   ├── test-strategy.md         ← strategi testing
│   ├── test-scenario.md         ← skenario testing
│   └── final-summary.md         ← ringkasan & rekomendasi
├── input/
│   ├── curl/                    ← curl commands
│   ├── postman/                 ← Postman collection
│   └── credential/              ← credentials
├── tests/api/
│   ├── helpers.ts               ← helper functions
│   ├── functional/              ← positive + data validation
│   ├── negative/                ← negative testing
│   ├── boundary/                ← boundary value testing
│   ├── security/                ← security testing
│   └── e2e/                     ← performance + integration
├── evidence/
│   ├── PASS/                    ← bukti test PASS (JSON + screenshot)
│   ├── FAIL/                    ← bukti test FAIL (JSON + screenshot)
│   └── screenshots/             ← HTML files untuk screenshot
├── reports/
│   ├── docx/                    ← laporan DOCX
│   ├── excel/                   ← laporan Excel
│   └── json/                    ← Playwright JSON results
├── scripts/
│   ├── parse-curl.py            ← parse curl → test spec
│   ├── generate-docx.py         ← generate laporan DOCX
│   ├── generate-excel.py        ← generate laporan Excel
│   ├── validate-report.py       ← validasi kelengkapan
│   └── run-screenshots.js       ← generate screenshot real
├── playwright.config.ts         ← konfigurasi Playwright
└── package.json
```

## Workflow Lengkap

```
1. INPUT
   ├── curl commands → input/curl/
   ├── credentials → config/api-config.env
   └── alpha test → input/alpha-test/

2. PARSE
   └── python scripts/parse-curl.py input/curl/endpoints.txt

3. TEST
   ├── npx playwright test tests/api/ --reporter=list
   └── node scripts/run-screenshots.js

4. REPORT
   ├── python scripts/generate-docx.py
   ├── python scripts/generate-excel.py
   └── python scripts/validate-report.py

5. UPLOAD
   └── git push origin api-testing-tarif
```

## Pengujian Baru

Untuk menambah pengujian baru:

1. **Tambah curl command** di `input/curl/endpoints.txt`
2. **Jalankan parse**: `python scripts/parse-curl.py input/curl/endpoints.txt`
3. **Edit test spec** di `tests/api/auto-generated.spec.ts`
4. **Jalankan test**: `npx playwright test tests/api/`
5. **Generate screenshot**: `node scripts/run-screenshots.js`
6. **Generate laporan**: `python scripts/generate-docx.py && python scripts/generate-excel.py`
7. **Validasi**: `python scripts/validate-report.py`

---

*Generated by Codebuff 🤖 — AI-Driven API Testing*
