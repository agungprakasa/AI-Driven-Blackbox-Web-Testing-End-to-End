import { test, expect } from '@playwright/test';
import {
  loadConfig, apiGet, apiPost, apiPut, apiPatch, apiDelete,
  expectStatus, expectJsonBody, expectFieldExists,
  logResponse, saveEvidence,
} from '../helpers';

const config = loadConfig();

test.describe('API CRUD Testing', () => {

  // ========================================
  // Contoh: Ganti endpoint & body sesuai API Anda
  // ========================================

  test('CREATE — POST /items', async ({ request }) => {
    const body = {
      name: 'Test Item',
      description: 'Item dari automated testing',
      price: 10000,
    };

    const start = Date.now();
    const response = await apiPost(request, config, '/items', body);
    const responseBody = await response.json();
    const duration = Date.now() - start;

    logResponse('POST /items', response.status(), responseBody);
    expectStatus(response, 201);
    expectJsonBody(response);
    expectFieldExists(responseBody, 'id');

    saveEvidence({
      testId: 'TC-API-001',
      endpoint: '/items',
      method: 'POST',
      requestBody: body,
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration,
    });
  });

  test('READ — GET /items', async ({ request }) => {
    const start = Date.now();
    const response = await apiGet(request, config, '/items');
    const responseBody = await response.json();
    const duration = Date.now() - start;

    logResponse('GET /items', response.status(), responseBody);
    expectStatus(response, 200);
    expectJsonBody(response);
    expect(Array.isArray(responseBody)).toBe(true);

    saveEvidence({
      testId: 'TC-API-002',
      endpoint: '/items',
      method: 'GET',
      responseStatus: response.status(),
      responseBody,
      timestamp: new Date().toISOString(),
      duration,
    });
  });

  test('READ — GET /items/:id', async ({ request }) => {
    // Ambil ID dari list
    const listResponse = await apiGet(request, config, '/items');
    const list = await listResponse.json();

    if (Array.isArray(list) && list.length > 0) {
      const id = list[0].id;
      const response = await apiGet(request, config, `/items/${id}`);
      const responseBody = await response.json();

      logResponse(`GET /items/${id}`, response.status(), responseBody);
      expectStatus(response, 200);
      expectFieldExists(responseBody, 'id');
      expect(responseBody.id).toBe(id);

      saveEvidence({
        testId: 'TC-API-003',
        endpoint: `/items/${id}`,
        method: 'GET',
        responseStatus: response.status(),
        responseBody,
        timestamp: new Date().toISOString(),
        duration: 0,
      });
    }
  });

  test('UPDATE — PUT /items/:id', async ({ request }) => {
    const listResponse = await apiGet(request, config, '/items');
    const list = await listResponse.json();

    if (Array.isArray(list) && list.length > 0) {
      const id = list[0].id;
      const body = {
        name: 'Updated Item',
        price: 20000,
      };

      const response = await apiPut(request, config, `/items/${id}`, body);
      const responseBody = await response.json();

      logResponse(`PUT /items/${id}`, response.status(), responseBody);
      expectStatus(response, 200);

      saveEvidence({
        testId: 'TC-API-004',
        endpoint: `/items/${id}`,
        method: 'PUT',
        requestBody: body,
        responseStatus: response.status(),
        responseBody,
        timestamp: new Date().toISOString(),
        duration: 0,
      });
    }
  });

  test('DELETE — DELETE /items/:id', async ({ request }) => {
    // Buat item baru lalu hapus
    const createResponse = await apiPost(request, config, '/items', {
      name: 'To Be Deleted',
      price: 1,
    });
    const created = await createResponse.json();

    if (created.id) {
      const response = await apiDelete(request, config, `/items/${created.id}`);
      const responseBody = await response.json().catch(() => ({}));

      logResponse(`DELETE /items/${created.id}`, response.status(), responseBody);
      expect([200, 204]).toContain(response.status());

      saveEvidence({
        testId: 'TC-API-005',
        endpoint: `/items/${created.id}`,
        method: 'DELETE',
        responseStatus: response.status(),
        responseBody,
        timestamp: new Date().toISOString(),
        duration: 0,
      });
    }
  });

});
