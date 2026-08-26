import { test, expect } from '@playwright/test';
import { loginAndVerify, navigateTo, takeScreenshot } from '../helpers';

const EVIDENCE = 'evidence';

test.describe('REPO — Reporting (Pelaporan)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndVerify(page);
  });

  test('TC-REPO-001: Lihat daftar paket', async ({ page }) => {
    await navigateTo(page, '/reporting/paket');
    await takeScreenshot(page, 'TC-REPO-001_daftar_paket', EVIDENCE);
  });

  test('TC-REPO-002: Lihat daftar bag', async ({ page }) => {
    await navigateTo(page, '/reporting/bag');
    await takeScreenshot(page, 'TC-REPO-002_daftar_bag', EVIDENCE);
  });

  test('TC-REPO-003: Tracking bag', async ({ page }) => {
    await navigateTo(page, '/reporting/tracking/bag');
    await takeScreenshot(page, 'TC-REPO-003_tracking_bag', EVIDENCE);
  });

  test('TC-REPO-004: Tracking bag item', async ({ page }) => {
    await navigateTo(page, '/reporting/tracking/bag-item');
    await takeScreenshot(page, 'TC-REPO-004_tracking_bag_item', EVIDENCE);
  });

  test('TC-REPO-005: Tracking events', async ({ page }) => {
    await navigateTo(page, '/reporting/tracking/tracking-events');
    await takeScreenshot(page, 'TC-REPO-005_tracking_events', EVIDENCE);
  });

  test('TC-REPO-006: Lihat daftar kedatangan', async ({ page }) => {
    await navigateTo(page, '/reporting/kedatangan');
    await takeScreenshot(page, 'TC-REPO-006_daftar_kedatangan', EVIDENCE);
  });

  test('TC-REPO-007: Lihat daftar angkutan', async ({ page }) => {
    await navigateTo(page, '/reporting/angkutan');
    await takeScreenshot(page, 'TC-REPO-007_daftar_angkutan', EVIDENCE);
  });

  test('TC-REPO-008: Laporan loading', async ({ page }) => {
    await navigateTo(page, '/reporting/operational/loading');
    await takeScreenshot(page, 'TC-REPO-008_laporan_loading', EVIDENCE);
  });

  test('TC-REPO-009: Laporan komisi agenpos', async ({ page }) => {
    await navigateTo(page, '/reporting/komisi');
    await takeScreenshot(page, 'TC-REPO-009_laporan_komisi', EVIDENCE);
  });

  test('TC-REPO-010: Laporan keuangan', async ({ page }) => {
    await navigateTo(page, '/reporting/keuangan');
    await takeScreenshot(page, 'TC-REPO-010_laporan_keuangan', EVIDENCE);
  });

});
