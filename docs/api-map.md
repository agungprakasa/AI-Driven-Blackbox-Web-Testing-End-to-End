# API Map — Tariff Service

## Daftar Endpoint

| No | Method | Endpoint | Deskripsi | Auth |
|----|--------|----------|-----------|------|
| 1 | POST | /test/1.0.0/getfeeLnDiscountNew | Hitung ongkos kirim dengan diskon | Tidak ada |

## Base URL
`http://10.29.41.37:8280`

## Parameter Map

### Request Parameters

| Parameter | Type | Required | Values | Description |
|-----------|------|----------|--------|-------------|
| customerid | string | Yes | Any string | ID pelanggan |
| desttypeid | string | Yes | 0, 1, 2 | Tipe destinasi |
| itemtypeid | string | Yes | 0, 1, 2, 3 | Tipe barang |
| shipperzipcode | string | Yes | 5 digit | Kode pos pengirim |
| receiverzipcode | string | Yes | 5 digit / 2 char | Kode pos/negara penerima |
| weight | number | Yes | >= 0 | Berat dalam gram |
| length | number | Yes | >= 0 | Panjang dalam cm |
| width | number | Yes | >= 0 | Lebar dalam cm |
| height | number | Yes | >= 0 | Tinggi dalam cm |
| diameter | number | Yes | >= 0 | Diameter dalam cm |
| valuegoods | number | Yes | >= 0 | Nilai barang dalam Rupiah |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| insurance | string | Biaya asuransi |
| estimation | string | Estimasi pengiriman |
| insurancetax | string | Pajak asuransi |
| fee | string | Ongkos kirim |
| feetax | string | Pajak ongkos kirim |
| totalfee | string | Total biaya |
| productid | string | ID produk |
| productname | string | Nama produk |
| discount | string | Diskon |
| fee_original | number | Ongkos kirim original |
| fee_diskon | number | Ongkos kirim setelah diskon |
