# Material Analysis — API Tariff

## Endpoint
- **URL**: `POST http://10.29.41.37:8280/test/1.0.0/getfeeLnDiscountNew`
- **Content-Type**: application/json
- **Authentication**: Tidak ada (public endpoint)

## Request Body Parameters

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| customerid | string | Ya | ID pelanggan (bisa kosong) |
| desttypeid | string | Ya | Tipe destinasi (0, 1, 2) |
| itemtypeid | string | Ya | Tipe barang (0, 1, 2, 3) |
| shipperzipcode | string | Ya | Kode pos pengirim (5 digit) |
| receiverzipcode | string | Ya | Kode pos penerima (5 digit atau kode negara) |
| weight | number | Ya | Berat barang dalam gram |
| length | number | Ya | Panjang paket dalam cm |
| width | number | Ya | Lebar paket dalam cm |
| height | number | Ya | Tinggi paket dalam cm |
| diameter | number | Ya | Diameter paket dalam cm (untuk paket bulat) |
| valuegoods | number | Ya | Nilai barang dalam Rupiah |

## Response Structure

```json
{
  "data": [
    {
      "insurance": "string",
      "estimation": "string",
      "insurancetax": "string",
      "penyesuaian": "string",
      "notes": "string",
      "productid": "string",
      "penyesuaianpersentase": "string",
      "totalfee": "string",
      "fee": "string",
      "feetax": "string",
      "productname": "string",
      "discount": "string",
      "fee_original": number,
      "fee_diskon": number,
      "feeTax_original": number,
      "feeTax_after_diskon": number,
      "htnb": "string",
      "ppnhtnb": number,
      "totalFeeBeforeDiskon": number,
      "totalFeeAfterDiskon": number,
      "persentaseDiskonApplicable": number
    }
  ]
}
```

## Produk yang Tersedia

| Product ID | Nama Produk |
|------------|-------------|
| 312 | EMS BARANG |
| 331 | PAKETPOS CEPAT LN |
| 332 | PAKETPOS BIASA LN |
| 3LP | ePacket LP APP |
| 3PE | POS EKSPOR |

## Temuan Awal

1. **Tidak ada autentikasi** — Endpoint dapat diakses tanpa token
2. **Tidak ada validasi input** — API menerima input invalid tanpa error
3. **Server crash untuk injection** — SQL injection dan XSS menyebabkan 500
4. **Response time cepat** — Rata-rata < 300ms untuk request valid
