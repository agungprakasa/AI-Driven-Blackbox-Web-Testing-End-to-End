import { APIRequestContext, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');

// ============================================================
// Config Loader
// ============================================================

export interface ApiConfig {
  baseUrl: string;
  authType: string;
  bearerToken: string;
  apiKey: string;
  apiKeyHeader: string;
  username: string;
  password: string;
  requestTimeout: number;
  rateLimitMs: number;
}

export function loadConfig(): ApiConfig {
  const envPath = path.join(ROOT, 'config', 'api-config.env');
  const config: ApiConfig = {
    baseUrl: '',
    authType: 'bearer',
    bearerToken: '',
    apiKey: '',
    apiKeyHeader: 'X-API-Key',
    username: '',
    password: '',
    requestTimeout: 30000,
    rateLimitMs: 1000,
  };

  if (!fs.existsSync(envPath)) {
    console.warn('config/api-config.env tidak ditemukan, menggunakan default');
    return config;
  }

  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;

    const key = trimmed.substring(0, eqIdx).trim();
    const value = trimmed.substring(eqIdx + 1).trim();

    switch (key) {
      case 'API_BASE_URL': config.baseUrl = value; break;
      case 'AUTH_TYPE': config.authType = value; break;
      case 'BEARER_TOKEN': config.bearerToken = value; break;
      case 'API_KEY': config.apiKey = value; break;
      case 'API_KEY_HEADER': config.apiKeyHeader = value; break;
      case 'API_USERNAME': config.username = value; break;
      case 'API_PASSWORD': config.password = value; break;
      case 'REQUEST_TIMEOUT': config.requestTimeout = parseInt(value) || 30000; break;
      case 'RATE_LIMIT_MS': config.rateLimitMs = parseInt(value) || 1000; break;
    }
  }

  return config;
}

// ============================================================
// Request Helpers
// ============================================================

export function getHeaders(config: ApiConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  switch (config.authType) {
    case 'bearer':
      if (config.bearerToken) {
        headers['Authorization'] = `Bearer ${config.bearerToken}`;
      }
      break;
    case 'apikey':
      if (config.apiKey) {
        headers[config.apiKeyHeader] = config.apiKey;
      }
      break;
    case 'basic':
      if (config.username && config.password) {
        const encoded = Buffer.from(`${config.username}:${config.password}`).toString('base64');
        headers['Authorization'] = `Basic ${encoded}`;
      }
      break;
  }

  return headers;
}

export async function apiGet(
  request: APIRequestContext,
  config: ApiConfig,
  endpoint: string,
  params?: Record<string, string>
) {
  let url = `${config.baseUrl}${endpoint}`;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  return request.get(url, {
    headers: getHeaders(config),
    timeout: config.requestTimeout,
  });
}

export async function apiPost(
  request: APIRequestContext,
  config: ApiConfig,
  endpoint: string,
  body?: any
) {
  return request.post(`${config.baseUrl}${endpoint}`, {
    headers: getHeaders(config),
    data: body,
    timeout: config.requestTimeout,
  });
}

export async function apiPut(
  request: APIRequestContext,
  config: ApiConfig,
  endpoint: string,
  body?: any
) {
  return request.put(`${config.baseUrl}${endpoint}`, {
    headers: getHeaders(config),
    data: body,
    timeout: config.requestTimeout,
  });
}

export async function apiPatch(
  request: APIRequestContext,
  config: ApiConfig,
  endpoint: string,
  body?: any
) {
  return request.patch(`${config.baseUrl}${endpoint}`, {
    headers: getHeaders(config),
    data: body,
    timeout: config.requestTimeout,
  });
}

export async function apiDelete(
  request: APIRequestContext,
  config: ApiConfig,
  endpoint: string
) {
  return request.delete(`${config.baseUrl}${endpoint}`, {
    headers: getHeaders(config),
    timeout: config.requestTimeout,
  });
}

// ============================================================
// Evidence Helpers
// ============================================================

export interface TestEvidence {
  testId: string;
  endpoint: string;
  method: string;
  requestBody?: any;
  responseStatus: number;
  responseBody: any;
  timestamp: string;
  duration: number;
}

export function saveEvidence(evidence: TestEvidence) {
  const evidenceDir = path.join(ROOT, 'evidence');
  const filename = `${evidence.testId}_${evidence.method.toLowerCase()}_${Date.now()}.json`;
  const filepath = path.join(evidenceDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(evidence, null, 2), 'utf-8');
}

export function logResponse(label: string, status: number, body: any) {
  console.log(`\n--- ${label} ---`);
  console.log(`Status: ${status}`);
  const bodyStr = JSON.stringify(body, null, 2);
  console.log(`Body: ${bodyStr.substring(0, 500)}${bodyStr.length > 500 ? '...' : ''}`);
}

// ============================================================
// Validation Helpers
// ============================================================

export function expectStatus(response: any, expected: number) {
  expect(response.status()).toBe(expected);
}

export function expectJsonBody(response: any) {
  const contentType = response.headers()['content-type'] || '';
  expect(contentType).toContain('application/json');
}

export function expectFieldExists(body: any, field: string) {
  expect(body).toHaveProperty(field);
}

export function expectFieldNotEmpty(body: any, field: string) {
  expect(body[field]).toBeTruthy();
}

export function expectArrayMinLength(body: any, field: string, minLength: number) {
  expect(Array.isArray(body[field])).toBe(true);
  expect(body[field].length).toBeGreaterThanOrEqual(minLength);
}

export { ROOT };
