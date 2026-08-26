import { test, expect } from '@playwright/test';
import { loginAndVerify, navigateTo, takeScreenshot } from '../helpers';

const EVIDENCE = 'evidence';

test.describe('COLL — Collecting (Transaksi)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndVerify(page);
  });

  test('TC-COLL-001: Akses beranda collecting', async ({ page }) => {
    await navigateTo(page, '/collecting');
    await takeScreenshot(page, 'TC-COLL-001_beranda_collecting', EVIDENCE);
  });

  test('TC-COLL-002: Buat transaksi baru — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/collecting/transaksi');
    await takeScreenshot(page, 'TC-COLL-002_transaksi_baru', EVIDENCE);

    const buttons = await page.locator('button:visible').count();
    const inputs = await page.locator('input:visible').count();
    console.log(`Transaksi: Buttons=${buttons} Inputs=${inputs}`);
  });

  test('TC-COLL-003: Lihat daftar transaksi', async ({ page }) => {
    await navigateTo(page, '/collecting/daftar-transaksi');
    await takeScreenshot(page, 'TC-COLL-003_daftar_transaksi', EVIDENCE);

    const tables = await page.locator('table').count();
    console.log(`Daftar Transaksi: Tables=${tables}`);
  });

  test('TC-COLL-004: Lihat backsheet transaksi', async ({ page }) => {
    await navigateTo(page, '/collecting/backsheet');
    await takeScreenshot(page, 'TC-COLL-004_backsheet', EVIDENCE);
  });

  test('TC-COLL-005: Lihat rekap harian', async ({ page }) => {
    await navigateTo(page, '/collecting/rekap-harian');
    await takeScreenshot(page, 'TC-COLL-005_rekap_harian', EVIDENCE);
  });

  test('TC-COLL-006: Audit koreksi — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/collecting/audit-koreksi');
    await takeScreenshot(page, 'TC-COLL-006_audit_koreksi', EVIDENCE);
  });

  test('TC-COLL-007: Pembatalan transaksi — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/collecting/pembatalan');
    await takeScreenshot(page, 'TC-COLL-007_pembatalan', EVIDENCE);
  });

  test('TC-COLL-008: Hitung tarif — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/referencing/tarif/calculate');
    await takeScreenshot(page, 'TC-COLL-008_hitung_tarif', EVIDENCE);
  });

});
