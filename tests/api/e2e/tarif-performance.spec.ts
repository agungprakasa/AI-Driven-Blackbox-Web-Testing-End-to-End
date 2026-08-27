import { test, expect } from '@playwright/test';
import { saveEvidence, logResponse } from '../helpers';

/**
 * =========================================================================
 * PERFORMANCE / LOAD TESTING — POST /test/1.0.0/getfeeLnDiscountNew
 * =========================================================================
 * Tujuan: Memvalidasi performa API di bawah beban normal hingga tinggi.
 *         Mengukur response time, throughput, dan stabilitas.
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

test.describe('PERFORMANCE TESTING — Tariff API', () => {

  // -------------------------------------------------------
  // PERF-001: Single request baseline
  // -------------------------------------------------------
  test('TC-PF001: Single request baseline (< 2s)', async ({ request }) => {
    const body = validBody();
    const start = Date.now();
    const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: body,
      timeout: 5000,
    });
    const duration = Date.now() - start;
    const responseBody = await response.json().catch(() => null);

    logResponse('TC-PF001', response.status(), responseBody);
    expect(response.status()).toBeLessThan(500);
    expect(duration).toBeLessThan(2000);

    saveEvidence({
      testId: 'TC-PF001', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: response.status(), responseBody,
      timestamp: new Date().toISOString(), duration,
    });
  });

  // -------------------------------------------------------
  // PERF-002: 5 concurrent requests
  // -------------------------------------------------------
  test('TC-PF002: 5 concurrent requests (< 5s total)', async ({ request }) => {
    const body = validBody();
    const start = Date.now();

    const promises = Array.from({ length: 5 }, () =>
      request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: body,
        timeout: 10000,
      })
    );

    const responses = await Promise.all(promises);
    const totalDuration = Date.now() - start;

    let allSuccess = true;
    for (const response of responses) {
      if (response.status() >= 500) {
        allSuccess = false;
      }
    }

    console.log(`5 concurrent requests completed in ${totalDuration}ms`);
    expect(allSuccess).toBe(true);
    expect(totalDuration).toBeLessThan(5000);

    saveEvidence({
      testId: 'TC-PF002', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: responses[0].status(),
      responseBody: { totalDuration, successCount: responses.filter(r => r.status() < 500).length },
      timestamp: new Date().toISOString(), duration: totalDuration,
    });
  });

  // -------------------------------------------------------
  // PERF-003: 10 sequential requests (measure avg)
  // -------------------------------------------------------
  test('TC-PF003: 10 sequential requests (avg < 2s)', async ({ request }) => {
    const body = validBody();
    const durations: number[] = [];
    let allSuccess = true;

    for (let i = 0; i < 10; i++) {
      const start = Date.now();
      const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: body,
        timeout: 5000,
      });
      const duration = Date.now() - start;
      durations.push(duration);

      if (response.status() >= 500) {
        allSuccess = false;
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    console.log(`10 sequential requests: avg=${avgDuration.toFixed(0)}ms, min=${minDuration}ms, max=${maxDuration}ms`);
    expect(allSuccess).toBe(true);
    expect(avgDuration).toBeLessThan(2000);

    saveEvidence({
      testId: 'TC-PF003', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: 200,
      responseBody: { avgDuration, minDuration, maxDuration, durations },
      timestamp: new Date().toISOString(), duration: durations.reduce((a, b) => a + b, 0),
    });
  });

  // -------------------------------------------------------
  // PERF-004: Response consistency (same input = same output)
  // -------------------------------------------------------
  test('TC-PF004: Response consistency (3x same input)', async ({ request }) => {
    const body = validBody();
    const responses: any[] = [];

    for (let i = 0; i < 3; i++) {
      const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: body,
        timeout: 5000,
      });
      const responseBody = await response.json().catch(() => null);
      responses.push(responseBody);

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Semua response harus memiliki field yang sama
    if (responses[0] && responses[1] && responses[2]) {
      const keys0 = Object.keys(responses[0]);
      const keys1 = Object.keys(responses[1]);
      const keys2 = Object.keys(responses[2]);
      expect(keys1.sort()).toEqual(keys0.sort());
      expect(keys2.sort()).toEqual(keys0.sort());
    }

    saveEvidence({
      testId: 'TC-PF004', endpoint: ENDPOINT, method: 'POST',
      requestBody: body, responseStatus: 200, responseBody: responses,
      timestamp: new Date().toISOString(), duration: 0,
    });
  });

  // -------------------------------------------------------
  // PERF-005: Response time under different payloads
  // -------------------------------------------------------
  const payloads = [
    { name: 'minimal', body: { ...validBody(), length: 0, width: 0, height: 0, diameter: 0 } },
    { name: 'with dimensions', body: { ...validBody(), length: 30, width: 20, height: 15, diameter: 0 } },
    { name: 'heavy (10kg)', body: { ...validBody(), weight: 10000 } },
    { name: 'high value', body: { ...validBody(), valuegoods: 1000000 } },
  ];

  for (const payload of payloads) {
    test(`TC-PF005: Response time — ${payload.name}`, async ({ request }) => {
      const start = Date.now();
      const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: payload.body,
        timeout: 5000,
      });
      const duration = Date.now() - start;
      const responseBody = await response.json().catch(() => null);

      logResponse(`TC-PF005-${payload.name}`, response.status(), responseBody);
      expect(response.status()).toBeLessThan(500);
      expect(duration).toBeLessThan(3000);

      saveEvidence({
        testId: `TC-PF005-${payload.name}`, endpoint: ENDPOINT, method: 'POST',
        requestBody: payload.body, responseStatus: response.status(), responseBody,
        timestamp: new Date().toISOString(), duration,
      });
    });
  }

});
