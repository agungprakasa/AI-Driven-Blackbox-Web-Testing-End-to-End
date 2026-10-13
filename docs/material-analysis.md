# Material Analysis — API Testing Demo

## Target

- Base URL: `https://dummyjson.com` (public demo REST API, digunakan sebagai target blackbox)
- Auth: none (public API)
- Format: JSON

## Analisis Endpoint yang Diuji

| Endpoint | Method | Fungsi | Risiko |
|---|---|---|---|
| /products/{id} | GET | Ambil produk by ID | Validasi rentang ID, handling 404 |
| /products?limit=N | GET | Daftar produk + limit | Parameter limit tidak divalidasi? |
| /products/search?q= | GET | Pencarian produk | Injection payload pada query |
| /products/add | POST | Tambah produk | Validasi body & tipe data |
| /carts/add | POST | Tambah keranjang | Struktur nested array |
| /products/categories | GET | Daftar kategori | Read-only, baseline |

## Pertimbangan Testing

1. Input tidak berasal dari source code — murni observasi respons (blackbox).
2. Prioritas: validasi input, handling error, keamanan query, performa.
3. Baseline performa: response < 2000ms untuk 100 record.
