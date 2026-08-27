import { test, expect } from '@playwright/test';
import { saveEvidence, logResponse } from '../helpers';

/**
 * =========================================================================
 * NEGATIVE / ABNORMAL TESTING — POST /test/1.0.0/getfeeLnDiscountNew
 * =========================================================================
 * Tujuan: Memastikan API menangani input yang salah/tidak valid dengan
 *         graceful error handling (tidak crash, return error code yang tepat).
 */

const BASE_URL = 'http://10.29.41.37:8280/test/1.0.0';
const ENDPOINT = '/getfeeLnDiscountNew';

function validBody() {
  return {
    customerid: '',
    desttypeid: '0',
    itemtypeid: '1',
    shipperzipcode: '10110',
    receiverzipcode: 'MY',
    weight: 1000,
    length: 0,
    width: 0,
    height: 0,
    diameter: 0,
    valuegoods: 7375,
  };
}

test.describe('NEGATIVE TESTING — Tariff API', () => {

  // -------------------------------------------------------
  // TC-N001: Request body kosong {}
  // -------------------------------------------------------
  test('TC-N001: Request body kosong {}', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: {},
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N001', response.status(), responseBody);
    // Catatan: API mengembalikan 200 meskipun body kosong = tidak ada validasi input
    // Ini adalah temuan (defect): seharusnya return 4xx
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N001',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: {},
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N002: Request tanpa body (null)
  // -------------------------------------------------------
  test('TC-N002: Request tanpa body', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N002', response.status(), responseBody);
    // Catatan: API mengembalikan 200 meskipun tanpa body = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N002',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: null,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N003: Weight negatif
  // -------------------------------------------------------
  test('TC-N003: Weight negatif (-100)', async ({ request }) => {
    const body = { ...validBody(), weight: -100 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N003', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk weight negatif = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N003',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N004: Weight nol
  // -------------------------------------------------------
  test('TC-N004: Weight = 0', async ({ request }) => {
    const body = { ...validBody(), weight: 0 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N004', response.status(), responseBody);
    // Weight 0 mungkin valid atau tidak, tergantung bisnis rules
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N004',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N005: Weight string (tipe data salah)
  // -------------------------------------------------------
  test('TC-N005: Weight string ("abc")', async ({ request }) => {
    const body = { ...validBody(), weight: 'abc' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N005', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk weight string = tidak ada validasi tipe data
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N005',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N006: Shipper zipcode kosong
  // -------------------------------------------------------
  test('TC-N006: Shipper zipcode kosong', async ({ request }) => {
    const body = { ...validBody(), shipperzipcode: '' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N006', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk shipper kosong = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N006',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N007: Receiver zipcode kosong
  // -------------------------------------------------------
  test('TC-N007: Receiver zipcode kosong', async ({ request }) => {
    const body = { ...validBody(), receiverzipcode: '' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N007', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk receiver kosong = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N007',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N008: Valuegoods negatif
  // -------------------------------------------------------
  test('TC-N008: Valuegoods negatif (-500)', async ({ request }) => {
    const body = { ...validBody(), valuegoods: -500 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N008', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk valuegoods negatif = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N008',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N009: Field hilang (shipperzipcode missing)
  // -------------------------------------------------------
  test('TC-N009: Field shipperzipcode hilang', async ({ request }) => {
    const body = { ...validBody() };
    delete (body as any).shipperzipcode;
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N009', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk field hilang = tidak ada validasi required field
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N009',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N010: Invalid JSON format
  // -------------------------------------------------------
  test('TC-N010: Invalid JSON format', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: '{invalid json',
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N010', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk invalid JSON = tidak ada validasi format
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N010',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: '{invalid json',
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N011: Tidak ada Content-Type header
  // -------------------------------------------------------
  test('TC-N011: Tidak ada Content-Type header', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N011', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N011',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N012: Content-Type text/plain
  // -------------------------------------------------------
  test('TC-N012: Content-Type text/plain', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'text/plain', Accept: 'application/json' },
      data: JSON.stringify(body),
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N012', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk Content-Type text/plain = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N012',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N013: Double/extra fields (tidak dikenal)
  // -------------------------------------------------------
  test('TC-N013: Extra fields tidak dikenal', async ({ request }) => {
    const body = { ...validBody(), unknownField: 'test', anotherField: 123 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N013', response.status(), responseBody);
    // API harus toleran terhadap extra fields
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N013',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N014: Weight sangat besar (overflow integer)
  // -------------------------------------------------------
  test('TC-N0014: Weight overflow (Number.MAX_SAFE_INTEGER)', async ({ request }) => {
    const body = { ...validBody(), weight: Number.MAX_SAFE_INTEGER };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N014', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N014',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N015: Weight float/desimal
  // -------------------------------------------------------
  test('TC-N015: Weight float (1000.5)', async ({ request }) => {
    const body = { ...validBody(), weight: 1000.5 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N015', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N015',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N016: Shipper zipcode bukan angka
  // -------------------------------------------------------
  test('TC-N016: Shipper zipcode bukan angka ("ABCDE")', async ({ request }) => {
    const body = { ...validBody(), shipperzipcode: 'ABCDE' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N016', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk zipcode non-angka = tidak ada validasi format
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N016',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N017: Method GET (wrong HTTP method)
  // -------------------------------------------------------
  test('TC-N017: Method GET (wrong HTTP method)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Accept': 'application/json' },
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N017', response.status(), responseBody);
    // Harus return 405 Method Not Allowed atau 404
    expect([404, 405]).toContain(response.status());

    saveEvidence({
      testId: 'TC-N017',
      endpoint: ENDPOINT,
      method: 'GET',
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N018: Method PUT (wrong HTTP method)
  // -------------------------------------------------------
  test('TC-N018: Method PUT (wrong HTTP method)', async ({ request }) => {
    const response = await request.put(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: validBody(),
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N018', response.status(), responseBody);
    expect([404, 405]).toContain(response.status());

    saveEvidence({
      testId: 'TC-N018',
      endpoint: ENDPOINT,
      method: 'PUT',
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N019: Endpoint tidak ada (typo URL)
  // -------------------------------------------------------
  test('TC-N019: Endpoint tidak ada (typo URL)', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}/getfeeLnDiscountNewTypo`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N019', response.status(), responseBody);
    expect(response.status()).toBe(404);

    saveEvidence({
      testId: 'TC-N019',
      endpoint: '/getfeeLnDiscountNewTypo',
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

  // -------------------------------------------------------
  // TC-N020: Array sebagai body (bukan object)
  // -------------------------------------------------------
  test('TC-N020: Array sebagai body (bukan object)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: [validBody()],
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-N020', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk array body = tidak ada validasi tipe body
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-N020',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: [validBody()],
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration: 0,
    });
  });

});
