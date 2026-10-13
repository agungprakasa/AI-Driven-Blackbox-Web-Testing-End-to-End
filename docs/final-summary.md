# Final Summary — API Testing Demo

## Hasil

| Metrik | Nilai |
|---|---|
| Total test case | 10 |
| PASS | 10 |
| FAIL | 0 |
| Pass rate | 100% |
| Defect tercatat | 1 (Low, closed) |

## Ringkasan Eksekuti

Pengujian blackbox terhadap `https://dummyjson.com` mencakup functional, negative,
boundary, security, integration, dan performance. Seluruh test case dieksekusi
live dengan evidence screenshot per test case.

## Temuan

- DEF-001 (Low): latensi cold-start 2490ms pada request pertama; eksekusi ulang
  515–696ms. Bukan bug fungsional — dicatat sebagai catatan performa.

## Rekomendasi

1. Regression suite ini bisa dijalankan otomatis di CI sebelum rilis.
2. Threshold performa perlu disesuaikan dengan SLO target lingkungan produksi.
3. Untuk API dengan autentikasi, tambahkan suite token lifecycle & authorization.
