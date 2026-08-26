import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, 'config/api-config.env') });

export default defineConfig({
  testDir: './tests/api',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/json/results.json' }],
  ],
  use: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
});
