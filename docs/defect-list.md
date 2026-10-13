# Defect List — API Testing Demo

| ID | Test Case | Judul | Severity | Status | Keterangan |
|---|---|---|---|---|---|
| DEF-001 | TC-PF001 | Latensi cold-start request pertama 2490ms (>2000ms) | Low | Closed | Terjadi hanya pada eksekusi pertama (DNS/TLS handshake). Eksekusi ulang 515–696ms. Catatan performa, bukan bug fungsional. |
