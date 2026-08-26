# AI-Driven API Testing — End-to-End

Template untuk pengujian REST API menggunakan pendekatan **AI-Driven Blackbox Testing**.

## Fitur
- Parse curl commands → auto-generate test spec
- API testing dengan Playwright (APIRequestContext)
- Support: Bearer Token, API Key, Basic Auth
- Laporan DOCX & Excel
- Validasi response status, body, schema

## Input yang Diperlukan

### 1. Curl Commands
Simpan curl commands di `input/curl/endpoints.txt`:

```bash
# GET /api/items
curl -X GET https://api.example.com/v1/items \
  -H "Authorization: Bearer TOKEN"

# POST /api/items
curl -X POST https://api.example.com/v1/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "price": 10000}'
```

### 2. Postman Collection (JSON)
Simpan Postman collection di `input/postman/collection.json`

### 3. Credentials
Isi `config/api-config.env`:
```
API_BASE_URL=https://api.example.com/v1
AUTH_TYPE=bearer
BEARER_TOKEN=eyJhbGciOiJIUzI1NiIs...
```

### 4. Alpha Test Results (opsional)
Simpan hasil alpha test di `input/alpha-test/`

## Cara Pakai

```bash
# 1. Parse curl → generate test spec
python scripts/parse-curl.py input/curl/endpoints.txt

# 2. Jalankan test
npx playwright test tests/api/ --reporter=list

# 3. Generate laporan
python scripts/generate-docx.py
python scripts/generate-excel.py

# 4. Validasi
python scripts/validate-report.py
```

## Struktur Direktori

```
├── config/api-config.env       ← konfigurasi API
├── input/
│   ├── curl/                   ← curl commands
│   ├── postman/                ← Postman collection
│   ├── credential/             ← credentials
│   └── alpha-test/             ← hasil alpha test
├── tests/api/
│   ├── helpers.ts              ← helper functions
│   ├── functional/             ← CRUD testing
│   ├── negative/               ← negative testing
│   ├── boundary/               ← boundary testing
│   ├── security/               ← security testing
│   └── e2e/                    ← end-to-end testing
├── evidence/PASS|FAIL/         ← bukti testing
├── reports/docx|excel/         ← laporan
└── scripts/                    ← script bantu
```

## Workflow

```
Input (curl/Postman) → Parse → Generate Test → Execute → Report
```
