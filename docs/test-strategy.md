# Test Strategy — API Testing Demo

## Pendekatan

Blackbox testing tanpa akses source code, dibantu AI agent untuk analisis dan pelaporan.

## Cakupan

1. **Functional (Positive)** — request valid mengembalikan data sesuai kontrak.
2. **Negative** — input tidak valid ditolak dengan status dan pesan yang benar.
3. **Boundary Value** — batas rentang ID (0, 1) diperlakukan benar.
4. **Security** — payload XSS pada query tidak dieksekusi, respons tetap JSON.
5. **Integration / E2E** — alur pembuatan cart dengan produk.
6. **Performance** — response time 100 record < 2000ms.

## Kriteria Selesai

- Semua test case dieksekusi dengan evidence screenshot.
- Setiap status PASS/FAIL didukung bukti response nyata.
- Laporan DOCX + Excel tervalidasi `validate-report.py`.

## Risiko & Mitigasi

- Target publik bisa tidak stabil → catat response time per eksekusi.
- Tidak ada akses source code → temuan dilaporkan sebagai observasi, bukan akar kode.
