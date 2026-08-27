# Test Scenario — API Tariff

## Scenario 1: Positive Testing
**Tujuan**: Memastikan API bekerja dengan input valid

| No | Scenario | Expected Result |
|----|----------|-----------------|
| 1 | Request dengan body valid lengkap | Status 200, data tarif dikembalikan |
| 2 | Request dengan weight berbeda | Tarif berbeda sesuai berat |
| 3 | Request domestic (kode pos Indonesia) | Tarif domestic |
| 4 | Request international (kode negara) | Tarif internasional |
| 5 | Request dengan dimensi paket | Tarif termasuk biaya dimensi |

## Scenario 2: Negative Testing
**Tujuan**: Memastikan API menangani input invalid

| No | Scenario | Expected Result |
|----|----------|-----------------|
| 1 | Body kosong {} | Status 400 Bad Request |
| 2 | Weight negatif | Status 400 Bad Request |
| 3 | Weight string (bukan number) | Status 400 Bad Request |
| 4 | Field wajib hilang | Status 400 Bad Request |
| 5 | Invalid JSON format | Status 400 Bad Request |

## Scenario 3: Boundary Value
**Tujuan**: Memvalidasi behavior di batas nilai

| No | Scenario | Expected Result |
|----|----------|-----------------|
| 1 | Weight minimum (1g) | Status 200 |
| 2 | Weight 0 | Status 200 atau 400 |
| 3 | Weight batas atas (30kg) | Status 200 |
| 4 | Dimensi 0x0x0 | Status 200 |
| 5 | Valuegoods 0 | Status 200 |

## Scenario 4: Security
**Tujuan**: Memvalidasi keamanan API

| No | Scenario | Expected Result |
|----|----------|-----------------|
| 1 | SQL Injection | Status 400 (reject) |
| 2 | XSS payload | Status 400 (reject) |
| 3 | Path traversal | Status 400 (reject) |
| 4 | XXE attack | Status 400 (reject) |
| 5 | Large payload | Status 413 atau 400 |

## Scenario 5: Performance
**Tujuan**: Memvalidasi performa API

| No | Scenario | Expected Result |
|----|----------|-----------------|
| 1 | Single request | Response < 2 detik |
| 2 | 5 concurrent requests | Semua < 5 detik |
| 3 | 10 sequential requests | Average < 2 detik |
| 4 | Response consistency | Struktur response konsisten |
