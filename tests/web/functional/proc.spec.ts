import { test, expect } from '@playwright/test';
import { loginAndVerify, navigateTo, takeScreenshot } from '../helpers';

const EVIDENCE = 'evidence';

test.describe('PROC — Processing (Pengolahan Paket)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndVerify(page);
  });

  test('TC-PROC-001: Receiving — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/processing/receiving');
    await takeScreenshot(page, 'TC-PROC-001_receiving_halamana', EVIDENCE);

    // Verifikasi halaman receiving tampil
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
  });

  test('TC-PROC-002: Receiving — elemen form terdeteksi', async ({ page }) => {
    await navigateTo(page, '/processing/receiving');

    // Kumpulkan info halaman
    const tables = await page.locator('table').count();
    const buttons = await page.locator('button:visible').count();
    const inputs = await page.locator('input:visible').count();

    console.log(`Receiving: Tables=${tables} Buttons=${buttons} Inputs=${inputs}`);

    await takeScreenshot(page, 'TC-PROC-002_receiving_elemen', EVIDENCE);
  });

  test('TC-PROC-003: Bagging — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/processing/bagging');
    await takeScreenshot(page, 'TC-PROC-003_bagging_halaman', EVIDENCE);
  });

  test('TC-PROC-004: Bagging — elemen form terdeteksi', async ({ page }) => {
    await navigateTo(page, '/processing/bagging');

    const tables = await page.locator('table').count();
    const buttons = await page.locator('button:visible').count();
    console.log(`Bagging: Tables=${tables} Buttons=${buttons}`);

    await takeScreenshot(page, 'TC-PROC-004_bagging_elemen', EVIDENCE);
  });

  test('TC-PROC-005: Manifest R7 — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/processing/manifest');
    await takeScreenshot(page, 'TC-PROC-005_manifest_halaman', EVIDENCE);
  });

  test('TC-PROC-006: Manifest R7 — elemen form terdeteksi', async ({ page }) => {
    await navigateTo(page, '/processing/manifest');

    const tables = await page.locator('table').count();
    const buttons = await page.locator('button:visible').count();
    console.log(`Manifest: Tables=${tables} Buttons=${buttons}`);

    await takeScreenshot(page, 'TC-PROC-006_manifest_elemen', EVIDENCE);
  });

  test('TC-PROC-007: Hand Over — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/processing/handover');
    await takeScreenshot(page, 'TC-PROC-007_handover_halaman', EVIDENCE);
  });

  test('TC-PROC-008: Hand Over — elemen form terdeteksi', async ({ page }) => {
    await navigateTo(page, '/processing/handover');

    const tables = await page.locator('table').count();
    const buttons = await page.locator('button:visible').count();
    console.log(`Hand Over: Tables=${tables} Buttons=${buttons}`);

    await takeScreenshot(page, 'TC-PROC-008_handover_elemen', EVIDENCE);
  });

  test('TC-PROC-009: Unbagging — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/processing/unbagging');
    await takeScreenshot(page, 'TC-PROC-009_unbagging_halaman', EVIDENCE);
  });

  test('TC-PROC-010: Loading — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/processing/loading');
    await takeScreenshot(page, 'TC-PROC-010_loading_halaman', EVIDENCE);
  });

  test('TC-PROC-011: Unloading — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/processing/unloading');
    await takeScreenshot(page, 'TC-PROC-011_unloading_halaman', EVIDENCE);
  });

  test('TC-PROC-012: Irregularity — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/processing/irregularity');
    await takeScreenshot(page, 'TC-PROC-012_irregularity_halaman', EVIDENCE);
  });

});
