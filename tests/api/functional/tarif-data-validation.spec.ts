import { test, expect } from '@playwright/test';
import { saveEvidence, logResponse } from '../helpers';

/**
 * =========================================================================
 * DATA VALIDATION TESTING — POST /test/1.0.0/getfeeLnDiscountNew
 * =========================================================================
 * Tujuan: Memvalidasi format, tipe data, dan struktur response API.
 *         Memastikan API mengembalikan data yang konsisten dan valid.
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

test.describe('DATA VALIDATION TESTING — Tariff API', () => {

  // -------------------------------------------------------
  // DV-001: Response harus JSON
  // -------------------------------------------------------
  test('TC-DV001: Response harus JSON', async ({ request }) => {
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
      testId: 'TC-DV001', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // DV-002: Response harus valid JSON (bukan HTML error page)
  // -------------------------------------------------------
  test('TC-DV002: Response body harus parseable JSON', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseText = await response.text();

    // Harus bisa di-parse sebagai JSON
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      throw new Error(`Response bukan valid JSON: ${responseText.substring(0, 200)}`);
    }

    expect(typeof parsed).toBe('object');

    saveEvidence({
      testId: 'TC-DV002', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody: parsed,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // DV-003: Response harus mengandung field tarif/fee
  // -------------------------------------------------------
  test('TC-DV003: Response harus mengandung informasi tarif', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(responseBody).not.toBeNull();

    // Cek kemungkinan field yang ada di response
    const responseStr = JSON.stringify(responseBody).toLowerCase();
    const hasTariffInfo =
      responseStr.includes('fee') ||
      responseStr.includes('tarif') ||
      responseStr.includes('price') ||
      responseStr.includes('cost') ||
      responseStr.includes('total') ||
      responseStr.includes('amount') ||
      responseStr.includes('rate') ||
      responseStr.includes('data') ||
      responseStr.includes('insurance') ||
      responseStr.includes('estimation') ||
      responseStr.includes('product');

    expect(hasTariffInfo).toBe(true);

    saveEvidence({
      testId: 'TC-DV003', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // DV-004: Tipe data response fields harus konsisten
  // -------------------------------------------------------
  test('TC-DV004: Tipe data response konsisten', async ({ request }) => {
    const body = validBody();
    const responses: any[] = [];

    // Kirim 3 request yang sama
    for (let i = 0; i < 3; i++) {
      const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: body,
      });
      const responseBody = await response.json().catch(() => null);
      responses.push(responseBody);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Bandingkan tipe data setiap field
    if (responses[0] && typeof responses[0] === 'object') {
      for (const key of Object.keys(responses[0])) {
        const type0 = typeof responses[0][key];
        for (let i = 1; i < responses.length; i++) {
          if (responses[i] && responses[i][key] !== undefined) {
            const typeI = typeof responses[i][key];
            expect(type0).toBe(typeI);
          }
        }
      }
    }

    saveEvidence({
      testId: 'TC-DV004', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: 200, responseBody: responses,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // DV-005: Numeric fields harus number, bukan string
  // -------------------------------------------------------
  test('TC-DV005: Numeric fields harus number', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(responseBody).not.toBeNull();

    if (typeof responseBody === 'object' && responseBody !== null) {
      for (const [key, value] of Object.entries(responseBody)) {
        // Cek field yang sepertinya numeric
        if (key.toLowerCase().includes('fee') ||
            key.toLowerCase().includes('price') ||
            key.toLowerCase().includes('cost') ||
            key.toLowerCase().includes('total') ||
            key.toLowerCase().includes('weight') ||
            key.toLowerCase().includes('discount')) {
          if (value !== null && value !== undefined) {
            expect(typeof value).toBe('number');
          }
        }
      }
    }

    saveEvidence({
      testId: 'TC-DV005', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // DV-006: Currency/tarif harus positif
  // -------------------------------------------------------
  test('TC-DV006: Currency/tarif harus positif', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(responseBody).not.toBeNull();

    if (typeof responseBody === 'object' && responseBody !== null) {
      for (const [key, value] of Object.entries(responseBody)) {
        if ((key.toLowerCase().includes('fee') ||
             key.toLowerCase().includes('price') ||
             key.toLowerCase().includes('cost') ||
             key.toLowerCase().includes('total')) &&
            typeof value === 'number') {
          expect(value).toBeGreaterThanOrEqual(0);
        }
      }
    }

    saveEvidence({
      testId: 'TC-DV006', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // DV-007: Response tidak boleh kosong (null atau {})
  // -------------------------------------------------------
  test('TC-DV007: Response tidak boleh kosong', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });
    const responseBody = await response.json().catch(() => null);

    expect(responseBody).not.toBeNull();

    if (typeof responseBody === 'object') {
      expect(Object.keys(responseBody).length).toBeGreaterThan(0);
    }

    saveEvidence({
      testId: 'TC-DV007', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // DV-008: Response HTTP status code valid
  // -------------------------------------------------------
  test('TC-DV008: HTTP status code 200 untuk valid request', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });

    expect(response.status()).toBe(200);

    saveEvidence({
      testId: 'TC-DV008', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody: null,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // DV-009: Response headers lengkap
  // -------------------------------------------------------
  test('TC-DV009: Response headers lengkap', async ({ request }) => {
    const body = validBody();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
    });

    const headers = response.headers();

    // Harus ada content-type
    expect(headers['content-type']).toBeDefined();
    expect(headers['content-type']).toContain('application/json');

    // Cek header lain yang mungkin ada
    console.log('Response headers:', JSON.stringify(headers, null, 2));

    saveEvidence({
      testId: 'TC-DV009', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody: { headers },
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // DV-010: Berbagai kombinasi zip code valid
  // -------------------------------------------------------
  const zipCombinations = [
    { shipper: '10110', receiver: '10110', desc: 'domestic-same' },
    { shipper: '10110', receiver: '20110', desc: 'domestic-different' },
    { shipper: '10110', receiver: 'MY', desc: 'international-MY' },
    { shipper: '10110', receiver: 'SG', desc: 'international-SG' },
    { shipper: '10110', receiver: 'ID', desc: 'country-ID' },
  ];

  for (const combo of zipCombinations) {
    test(`TC-DV010: Zip combo — ${combo.desc}`, async ({ request }) => {
      const body = { ...validBody(), shipperzipcode: combo.shipper, receiverzipcode: combo.receiver };
      const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: body,
      });
      const responseBody = await response.json().catch(() => null);

      expect(response.status()).toBeLessThan(500);

      // Response harus valid JSON
      if (responseBody) {
        expect(typeof responseBody).toBe('object');
      }

      saveEvidence({
        testId: `TC-DV010-${combo.desc}`, endpoint: ENDPOINT, method: 'POST',
        requestBody: body, responseStatus: response.status(), responseBody,
        timestamp: new Date().toISOString(), duration: 0,
      });
    });
  }

});
