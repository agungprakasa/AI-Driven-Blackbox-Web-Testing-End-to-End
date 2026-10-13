# Test Scenario — API Testing Demo

| No | Skenario | Endpoint | Test Case |
|---|---|---|---|
| 1 | Ambil produk valid by ID | GET /products/1 | TC-P001 |
| 2 | Daftar produk dengan limit | GET /products?limit=5 | TC-P002 |
| 3 | Tambah produk valid | POST /products/add | TC-P003 |
| 4 | Akses produk tidak ada | GET /products/999999 | TC-N001 |
| 5 | Kirim body bukan JSON | POST /products/add | TC-N002 |
| 6 | ID batas bawah valid | GET /products/1 | TC-B001 |
| 7 | ID di luar rentang | GET /products/0 | TC-B002 |
| 8 | XSS pada query pencarian | GET /products/search?q=... | TC-S001 |
| 9 | Buat cart berisi produk | POST /carts/add | TC-E2E001 |
| 10 | Performa 100 record | GET /products?limit=100 | TC-PF001 |
