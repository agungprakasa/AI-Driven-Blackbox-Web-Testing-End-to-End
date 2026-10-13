# Test Case — API Testing Demo (dummyjson.com)

Target: `https://dummyjson.com` (public demo REST API)
Metode: AI-Driven Blackbox Testing — tanpa akses source code.

| ID | Butir Uji | Endpoint | Request / Input | Expected Result | Prioritas | Status |
|---|---|---|---|---|---|---|
| TC-P001 | Ambil produk berdasarkan ID valid | GET /products/1 | Param path `id=1` | Status 200 dan field `title` terisi | High | PASS |
| TC-P002 | Daftar produk dengan limit | GET /products?limit=5 | Query `limit=5` | Status 200 dan tepat 5 produk dikembalikan | High | PASS |
| TC-P003 | Tambah produk dengan body valid | POST /products/add | JSON `{title, price, category}` | Status 201 dan `id` produk baru dikembalikan | High | PASS |
| TC-N001 | Produk dengan ID tidak ada | GET /products/999999 | Param path `id=999999` | Status 404 (resource tidak ditemukan) | High | PASS |
| TC-N002 | Body request bukan JSON valid | POST /products/add | Raw body `not-json` | Status 400 (request body ditolak) | High | PASS |
| TC-B001 | ID minimum valid (batas bawah) | GET /products/1 | Param path `id=1` | Status 200 (rentang bawah diterima) | Medium | PASS |
| TC-B002 | ID di bawah rentang valid | GET /products/0 | Param path `id=0` | Status 404 (di luar rentang valid) | Medium | PASS |
| TC-S001 | Payload XSS pada query pencarian | GET /products/search?q=`<script>alert(1)</script>` | Query mengandung tag script | Status 200 dengan Content-Type JSON (payload tidak dieksekusi) | High | PASS |
| TC-E2E001 | Buat keranjang berisi produk | POST /carts/add | JSON `{userId, products:[{id,quantity}]}` | Status 201 dan cart berisi produk | High | PASS |
| TC-PF001 | Performa daftar 100 produk | GET /products?limit=100 | Query `limit=100` | Status 200 dengan response time < 2000ms | Medium | PASS |
