# Test Case — Web Application Testing

| ID | Judul | Halaman/URL | Aksi/Input | Expected | Priority | Status |
|----|-------|-------------|------------|----------|----------|--------|
| TC-W001 | Halaman utama loaded | / | Buka URL | Halaman tampil lengkap | High | PASS |
| TC-W002 | Login valid | /login | Username: admin, Password: admin123 | Redirect ke dashboard | High | PASS |
| TC-W003 | Login invalid | /login | Username: wrong, Password: wrong | Error message ditampilkan | High | PASS |
| TC-W004 | Form submit valid | /form | Isi semua field valid | Data tersimpan, sukses | High | PASS |
| TC-W005 | Form submit kosong | /form | Submit tanpa isi | Validasi error muncul | Medium | NOK |
| TC-W006 | Navigasi menu | / | Klik setiap menu | Semua halaman dapat diakses | Medium | PASS |
| TC-W007 | Responsive mobile | / | Buka di viewport 375px | Layout menyesuaikan | Medium | PASS |
| TC-W008 | Responsive tablet | / | Buka di viewport 768px | Layout menyesuaikan | Medium | PASS |
| TC-W009 | Logout | /dashboard | Klik logout | Redirect ke login | High | PASS |
| TC-W010 | Akses tanpa login | /dashboard | Buka langsung URL | Redirect ke login | High | PASS |
| TC-W011 | XSS input | /form | Input: script alert | Script tidak dieksekusi | Critical | NOK |
| TC-W012 | SQL Injection | /login | Username: ' OR 1=1 | Error handling normal | Critical | PASS |
| TC-W013 | Upload file besar | /upload | Upload file 10MB | Validasi error ukuran | Medium | PASS |
| TC-W014 | Upload file invalid | /upload | Upload file .exe | File ditolak | High | PASS |
| TC-W015 | Search functionality | /search | Ketik keyword | Hasil relevan ditampilkan | Medium | PASS |
| TC-W016 | Pagination | /list | Klik halaman 2, 3 | Data berganti benar | Low | PASS |
| TC-W017 | Sort data | /list | Klik sort by name | Data terurut | Low | PASS |
| TC-W018 | Filter data | /list | Pilih filter | Data terfilter | Medium | PASS |
| TC-W019 | Error 404 | /nonexistent | Buka URL tidak ada | Halaman 404 ditampilkan | Medium | PASS |
| TC-W020 | Loading performance | / | Ukur waktu load | Halaman load < 3 detik | High | PASS |
