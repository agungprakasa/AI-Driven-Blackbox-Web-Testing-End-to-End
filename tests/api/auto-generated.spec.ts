import { test, expect } from '@playwright/test';

const BASE_URL = process.env.API_BASE_URL || 'https://api.example.com/v1';
const AUTH_TOKEN = process.env.BEARER_TOKEN || '';

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(AUTH_TOKEN ? { 'Authorization': `Bearer ${AUTH_TOKEN}` } : {}),
  };
}

test.describe('API Auto-Generated Tests', () => {

  test('1. POST 1.0.0/getfeeLnDiscountNew', async ({ request }) => {
    const response = await request.post('http://10.29.41.37:8280/test/1.0.0/getfeeLnDiscountNew', {
      headers: getHeaders(),
      data: {"customerid":"","desttypeid":"0","itemtypeid":"1","shipperzipcode":"10110","receiverzipcode":"MY","weight":1000,"length":0,"width":0,"height":0,"diameter":0,"valuegoods":7375},
    });

    expect(response.status()).toBeLessThan(500);
    const body = await response.json();
    console.log('Status:', response.status());
    console.log('Response:', JSON.stringify(body).substring(0, 200));
  });

});