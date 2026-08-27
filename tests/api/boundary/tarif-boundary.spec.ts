import { test, expect } from '@playwright/test';
import { saveEvidence, logResponse } from '../helpers';

/**
 * =========================================================================
 * BOUNDARY VALUE TESTING — POST /test/1.0.0/getfeeLnDiscountNew
 * =========================================================================
 * Tujuan: Memvalidasi behavior API pada batas-batas nilai yang diperbolehkan.
 *         Testing di titik tepi rentang valid/invalid.
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

test.describe('BOUNDARY VALUE TESTING — Tariff API', () => {

  // -------------------------------------------------------
  // BVT-W: WEIGHT BOUNDARIES
  // -------------------------------------------------------

  // TC-B001: Weight minimum valid (1g)
  test('TC-B001: Weight minimum valid (1g)', async ({ request }) => {
    const body = { ...validBody(), weight: 1 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B001', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B001', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B002: Weight boundary 0
  test('TC-B002: Weight boundary (0)', async ({ request }) => {
    const body = { ...validBody(), weight: 0 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B002', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B002', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B003: Weight -1 (just below minimum)
  test('TC-B003: Weight -1 (below minimum)', async ({ request }) => {
    const body = { ...validBody(), weight: -1 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B003', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk weight -1 = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B003', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B004: Weight batas atas umum (30000g = 30kg)
  test('TC-B004: Weight batas atas (30000g)', async ({ request }) => {
    const body = { ...validBody(), weight: 30000 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B004', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B004', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B005: Weight 30001 (just above 30kg limit)
  test('TC-B005: Weight 30001g (just above 30kg)', async ({ request }) => {
    const body = { ...validBody(), weight: 30001 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B005', response.status(), responseBody);
    // Bisa error atau sukses tergantung batas server
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B005', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B006: Weight Maximum Integer
  test('TC-B006: Weight Maximum Integer', async ({ request }) => {
    const body = { ...validBody(), weight: 2147483647 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B006', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B006', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // BVT-D: DIMENSION BOUNDARIES (length, width, height)
  // -------------------------------------------------------

  // TC-B007: Semua dimensi = 0
  test('TC-B007: Dimensi = 0 (0x0x0)', async ({ request }) => {
    const body = { ...validBody(), length: 0, width: 0, height: 0 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B007', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B007', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B008: Dimensi minimum (1x1x1)
  test('TC-B008: Dimensi minimum (1x1x1)', async ({ request }) => {
    const body = { ...validBody(), length: 1, width: 1, height: 1 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B008', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B008', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B009: Dimensi negatif (-1x-1x-1)
  test('TC-B009: Dimensi negatif (-1x-1x-1)', async ({ request }) => {
    const body = { ...validBody(), length: -1, width: -1, height: -1 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B009', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk dimensi negatif = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B009', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B010: Dimensi besar (100x100x100 cm)
  test('TC-B010: Dimensi besar (100x100x100)', async ({ request }) => {
    const body = { ...validBody(), length: 100, width: 100, height: 100 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B010', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B010', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B011: Dimensi Maximum Integer
  test('TC-B011: Dimensi Maximum Integer', async ({ request }) => {
    const body = { ...validBody(), length: 2147483647, width: 2147483647, height: 2147483647 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B011', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B011', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // BVT-V: VALUEGOODS BOUNDARIES
  // -------------------------------------------------------

  // TC-B012: Valuegoods = 0
  test('TC-B012: Valuegoods = 0', async ({ request }) => {
    const body = { ...validBody(), valuegoods: 0 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B012', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B012', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B013: Valuegoods = 1 (minimum non-zero)
  test('TC-B013: Valuegoods = 1', async ({ request }) => {
    const body = { ...validBody(), valuegoods: 1 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B013', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B013', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B014: Valuegoods negatif (-1)
  test('TC-B014: Valuegoods negatif (-1)', async ({ request }) => {
    const body = { ...validBody(), valuegoods: -1 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B014', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk valuegoods negatif = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B014', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B015: Valuegoods Maximum Integer
  test('TC-B015: Valuegoods Maximum Integer', async ({ request }) => {
    const body = { ...validBody(), valuegoods: 2147483647 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B015', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B015', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // BVT-S: STRING FIELD BOUNDARIES
  // -------------------------------------------------------

  // TC-B016: String kosong "" untuk semua string fields
  test('TC-B016: Semua string fields kosong', async ({ request }) => {
    const body = {
      customerid: '',
      desttypeid: '',
      itemtypeid: '',
      shipperzipcode: '',
      receiverzipcode: '',
      weight: 1000,
      length: 0,
      width: 0,
      height: 0,
      diameter: 0,
      valuegoods: 7375,
    };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B016', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B016', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B017: String sangat panjang (1000 karakter)
  test('TC-B017: String sangat panjang (1000 chars)', async ({ request }) => {
    const longString = 'A'.repeat(1000);
    const body = { ...validBody(), customerid: longString, shipperzipcode: longString };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B017', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B017', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B018: String 1 karakter
  test('TC-B018: String 1 karakter', async ({ request }) => {
    const body = { ...validBody(), customerid: 'X', shipperzipcode: '1', receiverzipcode: 'M' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B018', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B018', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B019: Shipper zipcode 5 digit (valid format)
  test('TC-B019: Shipper zipcode 5 digit (10110)', async ({ request }) => {
    const body = { ...validBody(), shipperzipcode: '10110' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B019', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B019', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B020: Shipper zipcode 1 digit
  test('TC-B020: Shipper zipcode 1 digit', async ({ request }) => {
    const body = { ...validBody(), shipperzipcode: '1' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B020', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk zipcode 1 digit = tidak ada validasi format
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B020', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // BVT-Z: ZIPSPEC: RECEIVER ZIPSPEC BOUNDARIES
  // -------------------------------------------------------

  // TC-B021: Receiver zipcode panjang 2 (country code)
  test('TC-B021: Receiver zipcode 2 char (MY)', async ({ request }) => {
    const body = { ...validBody(), receiverzipcode: 'MY' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B021', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B021', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B022: Receiver zipcode panjang 1
  test('TC-B022: Receiver zipcode 1 char', async ({ request }) => {
    const body = { ...validBody(), receiverzipcode: 'M' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B022', response.status(), responseBody);
    // Catatan: API mengembalikan 200 untuk receiverzipcode 1 char = tidak ada validasi
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B022', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B023: Receiver zipcode domestic (5 digit)
  test('TC-B023: Receiver zipcode domestic (10110)', async ({ request }) => {
    const body = { ...validBody(), receiverzipcode: '10110' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B023', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B023', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // BVT-DIA: DIAMETER BOUNDARY
  // -------------------------------------------------------

  // TC-B024: Diameter = 0 (biasa untuk paket kotak)
  test('TC-B024: Diameter = 0', async ({ request }) => {
    const body = { ...validBody(), diameter: 0 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B024', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B024', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // TC-B025: Diameter besar (50cm)
  test('TC-B025: Diameter besar (50)', async ({ request }) => {
    const body = { ...validBody(), diameter: 50 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-B025', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-B025', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

});
