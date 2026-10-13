import { test, expect } from '@playwright/test';

const BASE = 'https://dummyjson.com';

test.describe('Positive / Functional', () => {
  test('TC-P001 GET product by ID returns 200 with title', async ({ request }) => {
    const res = await request.get(`${BASE}/products/1`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBeTruthy();
  });

  test('TC-P002 GET products?limit=5 returns exactly 5 items', async ({ request }) => {
    const res = await request.get(`${BASE}/products?limit=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.products).toHaveLength(5);
  });

  test('TC-P003 POST valid product returns 201', async ({ request }) => {
    const res = await request.post(`${BASE}/products/add`, {
      data: { title: 'Playwright Demo Product', price: 49, category: 'smartphones' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
  });
});

test.describe('Negative', () => {
  test('TC-N001 GET missing product returns 404', async ({ request }) => {
    const res = await request.get(`${BASE}/products/999999`);
    expect(res.status()).toBe(404);
  });

  test('TC-N002 POST invalid JSON body returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/products/add`, {
      headers: { 'Content-Type': 'application/json' },
      data: 'not-json',
    });
    expect(res.status()).toBe(400);
  });
});

test.describe('Boundary Value', () => {
  test('TC-B001 minimum valid ID = 1 returns 200', async ({ request }) => {
    const res = await request.get(`${BASE}/products/1`);
    expect(res.status()).toBe(200);
  });

  test('TC-B002 ID below range (0) returns 404', async ({ request }) => {
    const res = await request.get(`${BASE}/products/0`);
    expect(res.status()).toBe(404);
  });
});

test.describe('Security', () => {
  test('TC-S001 XSS payload in search stays JSON, not executed', async ({ request }) => {
    const res = await request.get(`${BASE}/products/search?q=<script>alert(1)</script>`);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
  });
});

test.describe('Integration / E2E', () => {
  test('TC-E2E001 create cart with product returns 201', async ({ request }) => {
    const res = await request.post(`${BASE}/carts/add`, {
      data: { userId: 1, products: [{ id: 1, quantity: 1 }] },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.products.length).toBeGreaterThan(0);
  });
});

test.describe('Performance', () => {
  test('TC-PF001 list 100 products responds under 2000ms', async ({ request }) => {
    const start = Date.now();
    const res = await request.get(`${BASE}/products?limit=100`);
    const elapsed = Date.now() - start;
    expect(res.status()).toBe(200);
    expect(elapsed).toBeLessThan(2000);
  });
});
