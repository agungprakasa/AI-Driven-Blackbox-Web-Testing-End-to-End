# Test Strategy — API Tariff

## Pendekatan Testing
Menggunakan pendekatan **AI-Driven Blackbox Testing** dengan fokus pada:
1. Functional/Positive Testing
2. Negative/Abnormal Testing
3. Boundary Value Testing
4. Security Testing
5. Performance Testing
6. Data Validation Testing
7. Integration/E2E Testing

## Scope

### In Scope
- POST /test/1.0.0/getfeeLnDiscountNew
- Validasi request body
- Validasi response
- Keamanan API
- Performa dasar

### Out of Scope
- Autentikasi (endpoint tidak memerlukan)
- Database testing
- UI testing

## Test Environment
- **Server**: http://10.29.41.37:8280
- **Tool**: Playwright (APIRequestContext)
- **Framework**: TypeScript

## Risk Assessment

| Risiko | Kemungkinan | Dampak | Mitigasi |
|--------|-------------|--------|----------|
| SQL Injection | Tinggi | Kritis | Input validation |
| XSS | Tinggi | Kritis | Output encoding |
| Server Crash | Sedang | Tinggi | Error handling |
| Data Leak | Rendah | Sedang | Logging |

## Entry Criteria
- Endpoint dapat diakses
- Request body valid diterima
- Response dikembalikan dalam format JSON

## Exit Criteria
- Semua test case telah dieksekusi
- Defect telah didokumentasi
- Laporan telah dihasilkan
