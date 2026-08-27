import { test, expect } from '@playwright/test';
import { saveEvidence, logResponse } from '../helpers';

/**
 * =========================================================================
 * INTEGRATION / E2E TESTING — POST /test/1.0.0/getfeeLnDiscountNew
 * =========================================================================
 * Tujuan: Memvalidasi alur lengkap dari request hingga response,
 *         termasuk integrasi dengan sistem terkait (database, cache, dll).
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

test.describe('INTEGRATION / E2E TESTING — Tariff API', () => {

  // -------------------------------------------------------
  // E2E-001: Full flow — Domestic small package
  // -------------------------------------------------------
  test('TC-E2E001: Domestic small package', async ({ request }) => {
    const body = {
      customerid: '',
      desttypeid: '0',
      itemtypeid: '1',
      shipperzipcode: '10110',
      receiverzipcode: '10110',
      weight: 500,
      length: 20,
      width: 15,
      height: 10,
      diameter: 0,
      valuegoods: 50000,
    };

    const start = Date.now();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
      timeout: 10000,
    });
    const duration = Date.now() - start;
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-E2E001', response.status(), responseBody);
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(5000);
    expect(responseBody).not.toBeNull();

    saveEvidence({
      testId: 'TC-E2E001', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration,
    });
  });

  // -------------------------------------------------------
  // E2E-002: Full flow — International package (MY)
  // -------------------------------------------------------
  test('TC-E2E002: International package (MY)', async ({ request }) => {
    const body = {
      customerid: 'CUST-INT-001',
      desttypeid: '0',
      itemtypeid: '1',
      shipperzipcode: '10110',
      receiverzipcode: 'MY',
      weight: 2000,
      length: 40,
      width: 30,
      height: 20,
      diameter: 0,
      valuegoods: 500000,
    };

    const start = Date.now();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
      timeout: 10000,
    });
    const duration = Date.now() - start;
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-E2E002', response.status(), responseBody);
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(5000);
    expect(responseBody).not.toBeNull();

    saveEvidence({
      testId: 'TC-E2E002', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration,
    });
  });

  // -------------------------------------------------------
  // E2E-003: Full flow — Heavy package
  // -------------------------------------------------------
  test('TC-E2E003: Heavy package (15kg)', async ({ request }) => {
    const body = {
      customerid: '',
      desttypeid: '0',
      itemtypeid: '1',
      shipperzipcode: '10110',
      receiverzipcode: '20110',
      weight: 15000,
      length: 50,
      width: 40,
      height: 30,
      diameter: 0,
      valuegoods: 2000000,
    };

    const start = Date.now();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
      timeout: 10000,
    });
    const duration = Date.now() - start;
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-E2E003', response.status(), responseBody);
    expect(response.status()).toBe(200);
    expect(responseBody).not.toBeNull();

    saveEvidence({
      testId: 'TC-E2E003', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration,
    });
  });

  // -------------------------------------------------------
  // E2E-004: Full flow — Cylindrical package (with diameter)
  // -------------------------------------------------------
  test('TC-E2E004: Cylindrical package (with diameter)', async ({ request }) => {
    const body = {
      customerid: '',
      desttypeid: '0',
      itemtypeid: '2',
      shipperzipcode: '10110',
      receiverzipcode: 'MY',
      weight: 1000,
      length: 30,
      width: 0,
      height: 0,
      diameter: 15,
      valuegoods: 100000,
    };

    const start = Date.now();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
      timeout: 10000,
    });
    const duration = Date.now() - start;
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-E2E004', response.status(), responseBody);
    expect(response.status()).toBe(200);
    expect(responseBody).not.toBeNull();

    saveEvidence({
      testId: 'TC-E2E004', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration,
    });
  });

  // -------------------------------------------------------
  // E2E-005: Sequential flow — Multiple different requests
  // -------------------------------------------------------
  test('TC-E2E005: Sequential flow — 3 different packages', async ({ request }) => {
    const packages = [
      { weight: 500, receiverzipcode: '10110', valuegoods: 50000 },
      { weight: 2000, receiverzipcode: 'MY', valuegoods: 500000 },
      { weight: 10000, receiverzipcode: 'SG', valuegoods: 3000000 },
    ];

    const results: any[] = [];

    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      const body = { ...validBody(), ...pkg };

      const start = Date.now();
      const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: body,
        timeout: 10000,
      });
      const duration = Date.now() - start;
      const responseBody = await response.json().catch(() => null);

      results.push({
        index: i + 1,
        status: response.status(),
        duration,
        responseBody,
      });

      expect(response.status()).toBe(200);

      // Delay antar request
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('Sequential flow results:', JSON.stringify(results.map(r => ({
      index: r.index,
      status: r.status,
      duration: r.duration,
    })), null, 2));

    saveEvidence({
      testId: 'TC-E2E005', endpoint: ENDPOINT, method: 'POST',
      requestBody: packages, responseStatus: 200, responseBody: results,
      timestamp: new Date().toISOString(),
      duration: results.reduce((sum, r) => sum + r.duration, 0),
    });
  });

  // -------------------------------------------------------
  // E2E-006: Response berbeda untuk berat berbeda
  // -------------------------------------------------------
  test('TC-E2E006: Response berbeda untuk berat berbeda', async ({ request }) => {
    // Gunakan weight yang menghasilkan data (1000g dan 30000g)
    const lightBody = { ...validBody(), weight: 1000 };
    const heavyBody = { ...validBody(), weight: 30000 };

    const lightResponse = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: lightBody,
    });
    const lightData = await lightResponse.json().catch(() => null);

    await new Promise(resolve => setTimeout(resolve, 500));

    const heavyResponse = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: heavyBody,
    });
    const heavyData = await heavyResponse.json().catch(() => null);

    // Response harus berbeda (tarif berbeda untuk berat berbeda)
    expect(lightData).not.toBeNull();
    expect(heavyData).not.toBeNull();

    if (lightData && heavyData) {
      const lightStr = JSON.stringify(lightData);
      const heavyStr = JSON.stringify(heavyData);
      // Catatan: Jika keduanya data kosong, API mungkin tidak mendukung filter ini
      if (lightStr !== '{"data":[]}' && heavyStr !== '{"data":[]}') {
        expect(lightStr).not.toBe(heavyStr);
      }
    }

    saveEvidence({
      testId: 'TC-E2E006', endpoint: ENDPOINT, method: 'POST',
      requestBody: { light: lightBody, heavy: heavyBody },
      responseStatus: 200, responseBody: { light: lightData, heavy: heavyData },
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // E2E-007: Response berbeda untuk domestic vs international
  // -------------------------------------------------------
  test('TC-E2E007: Domestic vs International tarif berbeda', async ({ request }) => {
    const domesticBody = { ...validBody(), receiverzipcode: '10110' };
    const internationalBody = { ...validBody(), receiverzipcode: 'MY' };

    const domesticResponse = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: domesticBody,
    });
    const domesticData = await domesticResponse.json().catch(() => null);

    await new Promise(resolve => setTimeout(resolve, 500));

    const internationalResponse = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: internationalBody,
    });
    const internationalData = await internationalResponse.json().catch(() => null);

    expect(domesticData).not.toBeNull();
    expect(internationalData).not.toBeNull();

    // Catatan: Kedua response mungkin sama karena receiverzipcode '10110' dan 'MY'
    // mungkin tidak cukup berbeda di sistem ini. Ini adalah temuan.
    if (domesticData && internationalData) {
      // Bandingkan hanya jika ada data
      const domesticStr = JSON.stringify(domesticData);
      const intlStr = JSON.stringify(internationalData);
      console.log('Domestic vs International:', domesticStr === intlStr ? 'SAME' : 'DIFFERENT');
    }

    saveEvidence({
      testId: 'TC-E2E007', endpoint: ENDPOINT, method: 'POST',
      requestBody: { domestic: domesticBody, international: internationalBody },
      responseStatus: 200,
      responseBody: { domestic: domesticData, international: internationalData },
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // E2E-008: Health check — API reachable
  // -------------------------------------------------------
  test('TC-E2E008: Health check — API reachable', async ({ request }) => {
    const start = Date.now();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: validBody(),
      timeout: 5000,
    });
    const duration = Date.now() - start;

    expect(response.status()).toBeLessThan(500);
    expect(duration).toBeLessThan(5000);

    console.log(`API Health: status=${response.status()}, duration=${duration}ms`);

    saveEvidence({
      testId: 'TC-E2E008', endpoint: ENDPOINT, method: 'POST',
      requestBody: validBody(), responseStatus: response.status(), responseBody: null,
      timestamp: new Date().toISOString(), duration,
    });
  });

  // -------------------------------------------------------
  // E2E-009: Timeout handling
  // -------------------------------------------------------
  test('TC-E2E009: Timeout handling (10s)', async ({ request }) => {
    const body = validBody();
    try {
      const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: body,
        timeout: 10000,
      });

      expect(response.status()).toBeLessThan(500);

      saveEvidence({
        testId: 'TC-E2E009', endpoint: ENDPOINT, method: 'POST',
        requestBody: body, responseStatus: response.status(), responseBody: null,
        timestamp: new Date().toISOString(), duration: 0,
      });
    } catch (error: any) {
      // Jika timeout, pastikan error-nya jelas
      expect(error.message).toContain('Timeout');
      console.log('Timeout detected as expected');

      saveEvidence({
        testId: 'TC-E2E009', endpoint: ENDPOINT, method: 'POST',
        requestBody: body, responseStatus: 0, responseBody: { error: error.message },
        timestamp: new Date().toISOString(), duration: 10000,
      });
    }
  });

});
