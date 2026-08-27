# Daftar Defect — API Tariff (getfeeLnDiscountNew)

| DEF-ID | Judul | Severity | Test Case | Deskripsi |
|--------|-------|----------|-----------|-----------|
| DEF-001 | Tidak ada validasi input body | High | TC-N-001, TC-N-002 | API mengembalikan 200 untuk body kosong dan tanpa body. Seharusnya return 400 Bad Request. |
| DEF-002 | Tidak ada validasi weight negatif | High | TC-N-003, TC-B-003 | API mengembalikan 200 untuk weight negatif (-1, -100). Seharusnya return 400. |
| DEF-003 | Tidak ada validasi tipe data weight | High | TC-N-005 | API mengembalikan 200 untuk weight berupa string "abc". Seharusnya return 400. |
| DEF-004 | Tidak ada validasi required field | High | TC-N-006, TC-N-007, TC-N-009 | API mengembalikan 200 untuk shipperzipcode kosong, receiverzipcode kosong, dan field hilang. Seharusnya return 400. |
| DEF-005 | Tidak ada validasi valuegoods negatif | High | TC-N-008, TC-B-014 | API mengembalikan 200 untuk valuegoods negatif. Seharusnya return 400. |
| DEF-006 | Tidak ada validasi format JSON | High | TC-N-010 | API mengembalikan 200 untuk invalid JSON format. Seharusnya return 400. |
| DEF-007 | Tidak ada validasi Content-Type | Medium | TC-N-012 | API mengembalikan 200 untuk Content-Type text/plain. Seharusnya return 415 Unsupported Media Type. |
| DEF-008 | Tidak ada validasi format zipcode | Medium | TC-N-016, TC-B-020 | API mengembalikan 200 untuk zipcode non-angka. Seharusnya return 400. |
| DEF-009 | SQL Injection menyebabkan server crash | Critical | TC-S-001 | API mengembalikan 500 untuk SQL injection di shipperzipcode. Server tidak handle injection dengan benar. |
| DEF-010 | XSS menyebabkan server crash | Critical | TC-S-004 | API mengembalikan 500 untuk XSS payload di customerid. Server tidak handle malicious input. |
| DEF-011 | Path traversal menyebabkan server crash | Critical | TC-S-009 | API mengembalikan 500 untuk path traversal di customerid. Server tidak handle input dengan path karakter. |
| DEF-012 | Nested JSON menyebabkan server crash | High | TC-S-016 | API mengembalikan 500 untuk deeply nested JSON. Server tidak handle extreme nesting. |
| DEF-013 | Dimensi negatif diterima | Medium | TC-B-009 | API mengembalikan 200 untuk dimensi negatif (-1). Seharusnya return 400 atau gunakan absolute value. |
| DEF-014 | Tidak ada validasi array body | Medium | TC-N-020 | API mengembalikan 200 untuk array sebagai body. Seharusnya return 400. |
| DEF-015 | X-Powered-By header bocor versi PHP | Low | TC-S-019 | Response header mengandung "X-Powered-By: PHP/8.1.24". Seharusnya dihapus untuk keamanan. |
| DEF-016 | Tidak ada input validation untuk extra fields | Low | TC-N-013 | API menerima extra fields tanpa error. Seharusnya reject atau ignore dengan pesan. |
