import { test, expect } from '@playwright/test';
import { saveEvidence, logResponse } from '../helpers';

/**
 * =========================================================================
 * POSITIVE / FUNCTIONAL TESTING — POST /test/1.0.0/getfeeLnDiscountNew
 * =========================================================================
 * Tujuan: Memastikan API mengembalikan response yang benar untuk
 *         input yang valid dan sesuai spesifikasi.
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

test.describe('POSITIVE TESTING — Tariff API', () => {

  // -------------------------------------------------------
  // TC-P001: Request standar dengan data valid
  // -------------------------------------------------------
  test('TC-P001: Request valid standar', async ({ request }) => {
    const body = validBody();
    const start = Date.now();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const duration = Date.now() - start;
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-P001', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-P001',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration,
    });
  });

  // -------------------------------------------------------
  // TC-P002: Weight dalam satuan gram
  // -------------------------------------------------------
  test('TC-P002: Weight dalam gram (1000g = 1kg)', async ({ request }) => {
    const body = { ...validBody(), weight: 1000 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(response.status()).toBeLessThan(500);
    if (responseBody) {
      // Response harus mengandung informasi tarif
      expect(typeof responseBody).toBe('object');
    }

    saveEvidence({
      testId: 'TC-P002',
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
  // TC-P003: Berbagai jenis itemtypeid
  // -------------------------------------------------------
  const itemTypes = ['1', '2', '3', '0'];
  for (const itemType of itemTypes) {
    test(`TC-P003: itemtypeid = "${itemType}"`, async ({ request }) => {
      const body = { ...validBody(), itemtypeid: itemType };
      const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: body,
      });
      const responseBody = await response.json().catch(() => null);

      expect(response.status()).toBeLessThan(500);

      saveEvidence({
        testId: `TC-P003-${itemType}`,
        endpoint: ENDPOINT,
        method: 'POST',
        requestBody: body,
        responseStatus: response.status(),
        responseBody,
        timestamp: new Date().toISOString(),
        duration: 0,
      });
    });
  }

  // -------------------------------------------------------
  // TC-P004: Berbagai jenis desttypeid
  // -------------------------------------------------------
  const destTypes = ['0', '1', '2'];
  for (const destType of destTypes) {
    test(`TC-P004: desttypeid = "${destType}"`, async ({ request }) => {
      const body = { ...validBody(), desttypeid: destType };
      const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: body,
      });
      const responseBody = await response.json().catch(() => null);

      expect(response.status()).toBeLessThan(500);

      saveEvidence({
        testId: `TC-P004-${destType}`,
        endpoint: ENDPOINT,
        method: 'POST',
        requestBody: body,
        responseStatus: response.status(),
        responseBody,
        timestamp: new Date().toISOString(),
        duration: 0,
      });
    });
  }

  // -------------------------------------------------------
  // TC-P005: Domestic shipping (Indonesia ke Indonesia)
  // -------------------------------------------------------
  test('TC-P005: Domestic shipping (10110 → 10110)', async ({ request }) => {
    const body = { ...validBody(), shipperzipcode: '10110', receiverzipcode: '10110' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-P005',
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
  // TC-P006: International shipping (MY)
  // -------------------------------------------------------
  test('TC-P006: International shipping (10110 → MY)', async ({ request }) => {
    const body = { ...validBody(), shipperzipcode: '10110', receiverzipcode: 'MY' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-P006',
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
  // TC-P007: Weight besar (10kg)
  // -------------------------------------------------------
  test('TC-P007: Weight besar (10000g)', async ({ request }) => {
    const body = { ...validBody(), weight: 10000 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-P007',
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
  // TC-P008: Dimensi paket (length, width, height)
  // -------------------------------------------------------
  test('TC-P008: Dimensi paket (30x20x15 cm)', async ({ request }) => {
    const body = { ...validBody(), length: 30, width: 20, height: 15 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-P008',
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
  // TC-P009: Valuegoods tinggi
  // -------------------------------------------------------
  test('TC-P009: Valuegoods tinggi (1000000)', async ({ request }) => {
    const body = { ...validBody(), valuegoods: 1000000 };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-P009',
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
  // TC-P010: Customerid terisi
  // -------------------------------------------------------
  test('TC-P010: Customerid terisi', async ({ request }) => {
    const body = { ...validBody(), customerid: 'CUST-001' };
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(response.status()).toBeLessThan(500);

    saveEvidence({
      testId: 'TC-P010',
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
  // TC-P011: Response format validasi
  // -------------------------------------------------------
  test('TC-P011: Response harus berupa JSON', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const contentType = response.headers()['content-type'] || '';

    expect(contentType).toContain('application/json');

    const responseBody = await response.json().catch(() => null);
    expect(responseBody).not.toBeNull();
    expect(typeof responseBody).toBe('object');

    saveEvidence({
      testId: 'TC-P011',
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
  // TC-P012: Response time < 5 detik
  // -------------------------------------------------------
  test('TC-P012: Response time < 5000ms', async ({ request }) => {
    const body = validBody();
    const start = Date.now();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const duration = Date.now() - start;
    const responseBody = await response.json().catch(() => null);

    expect(duration).toBeLessThan(5000);

    saveEvidence({
      testId: 'TC-P012',
      endpoint: ENDPOINT,
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration,
    });
  });

});
