# API Map — API Testing Demo

Base URL: `https://dummyjson.com`

| No | Method | Endpoint | Parameter | Auth | Respons |
|---|---|---|---|---|---|
| 1 | GET | /products/{id} | path: id (int) | None | 200 / 404 |
| 2 | GET | /products | query: limit (int) | None | 200, `{products: [...]}` |
| 3 | GET | /products/search | query: q (string) | None | 200, `{products: [...]}` |
| 4 | POST | /products/add | body: JSON | None | 201 + objek baru |
| 5 | GET | /products/999999 | path: id tidak valid | None | 404 |
| 6 | POST | /carts/add | body: `{userId, products[]}` | None | 201 + cart |
| 7 | GET | /products/categories | - | None | 200, daftar kategori |

Coverage test case: endpoint 1–6 (7 dipakai sebagai referensi respons).
