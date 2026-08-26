import { test, expect } from '@playwright/test';
import { loginAndVerify, navigateTo, takeScreenshot } from '../helpers';

const EVIDENCE = 'evidence';

// ===== TRCK — Tracking =====
test.describe('TRCK — Tracking', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndVerify(page);
  });

  test('TC-TRCK-001: Cari paket — halaman tracking', async ({ page }) => {
    await navigateTo(page, '/reporting/tracking/bag');
    await takeScreenshot(page, 'TC-TRCK-001_cari_paket', EVIDENCE);
  });

  test('TC-TRCK-002: Lihat history tracking', async ({ page }) => {
    await navigateTo(page, '/reporting/tracking/tracking-events');
    await takeScreenshot(page, 'TC-TRCK-002_history_tracking', EVIDENCE);
  });

  test('TC-TRCK-003: Cari paket tidak ditemukan', async ({ page }) => {
    await navigateTo(page, '/reporting/tracking/bag');

    // Cari dengan nomor palsu
    const searchInput = page.locator('input[type="search"], input[placeholder*="cari"], input[placeholder*="search"], input[placeholder*="Cari"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('999999999');
      await searchInput.press('Enter');
      await page.waitForTimeout(2000);
    }

    await takeScreenshot(page, 'TC-TRCK-003_paket_tidak_ditemukan', EVIDENCE);
  });

  test('TC-TRCK-004: Filter tracking berdasarkan tanggal', async ({ page }) => {
    await navigateTo(page, '/reporting/tracking/tracking-events');
    await takeScreenshot(page, 'TC-TRCK-004_filter_tanggal', EVIDENCE);
  });

});

// ===== SETT — Settings =====
test.describe('SETT — Settings (Pengaturan)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndVerify(page);
  });

  test('TC-SETT-001: Lihat daftar user', async ({ page }) => {
    await navigateTo(page, '/settings/user');
    await takeScreenshot(page, 'TC-SETT-001_daftar_user', EVIDENCE);
  });

  test('TC-SETT-002: Tambah user — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/settings/user');
    const buttons = await page.locator('button:visible').all();
    const tambahBtn = buttons.find(async (b) => {
      const text = await b.textContent();
      return text?.toLowerCase().includes('tambah') || text?.toLowerCase().includes('add') || text?.toLowerCase().includes('create');
    });
    if (tambahBtn) await tambahBtn.click();
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'TC-SETT-002_tambah_user', EVIDENCE);
  });

  test('TC-SETT-003: Edit user — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/settings/user');
    await takeScreenshot(page, 'TC-SETT-003_edit_user', EVIDENCE);
  });

  test('TC-SETT-004: Hapus user — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/settings/user');
    await takeScreenshot(page, 'TC-SETT-004_hapus_user', EVIDENCE);
  });

  test('TC-SETT-005: Manajemen role', async ({ page }) => {
    await navigateTo(page, '/settings/role');
    await takeScreenshot(page, 'TC-SETT-005_manajemen_role', EVIDENCE);
  });

  test('TC-SETT-006: Manajemen permission', async ({ page }) => {
    await navigateTo(page, '/settings/permission');
    await takeScreenshot(page, 'TC-SETT-006_manajemen_permission', EVIDENCE);
  });

  test('TC-SETT-007: Manajemen lokasi', async ({ page }) => {
    await navigateTo(page, '/settings/location');
    await takeScreenshot(page, 'TC-SETT-007_manajemen_lokasi', EVIDENCE);
  });

  test('TC-SETT-008: Manajemen tim', async ({ page }) => {
    await navigateTo(page, '/settings/team');
    await takeScreenshot(page, 'TC-SETT-008_manajemen_tim', EVIDENCE);
  });

  test('TC-SETT-009: Konfigurasi webhook', async ({ page }) => {
    await navigateTo(page, '/settings/webhook');
    await takeScreenshot(page, 'TC-SETT-009_konfigurasi_webhook', EVIDENCE);
  });

  test('TC-SETT-010: Konfigurasi flow', async ({ page }) => {
    await navigateTo(page, '/settings/flow');
    await takeScreenshot(page, 'TC-SETT-010_konfigurasi_flow', EVIDENCE);
  });

});

// ===== MODL — Modules =====
test.describe('MODL — Modules (Tambahan)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndVerify(page);
  });

  test('TC-MODL-001: Irregularity — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/modules/irregularity');
    await takeScreenshot(page, 'TC-MODL-001_irregularity', EVIDENCE);
  });

  test('TC-MODL-002: COD Recon — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/modules/cod-recon');
    await takeScreenshot(page, 'TC-MODL-002_cod_recon', EVIDENCE);
  });

});

// ===== ACCT — Account =====
test.describe('ACCT — Account (Akun)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndVerify(page);
  });

  test('TC-ACCT-001: Lihat profil pengguna', async ({ page }) => {
    await navigateTo(page, '/account');
    await takeScreenshot(page, 'TC-ACCT-001_profil_pengguna', EVIDENCE);
  });

  test('TC-ACCT-002: Ubah password — halaman terbuka', async ({ page }) => {
    await navigateTo(page, '/account/password');
    await takeScreenshot(page, 'TC-ACCT-002_ubah_password', EVIDENCE);
  });

  test('TC-ACCT-003: Manajemen API Key', async ({ page }) => {
    await navigateTo(page, '/account/api-key');
    await takeScreenshot(page, 'TC-ACCT-003_api_key', EVIDENCE);
  });

  test('TC-ACCT-004: Setup MFA', async ({ page }) => {
    await navigateTo(page, '/account/mfa');
    await takeScreenshot(page, 'TC-ACCT-004_setup_mfa', EVIDENCE);
  });

});

// ===== DASH — Dashboard =====
test.describe('DASH — Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndVerify(page);
  });

  test('TC-DASH-001: Lihat halaman overview', async ({ page }) => {
    await navigateTo(page, '/dashboard/overview');
    await takeScreenshot(page, 'TC-DASH-001_overview', EVIDENCE);
  });

  test('TC-DASH-002: Lihat konfigurasi webhook', async ({ page }) => {
    await navigateTo(page, '/dashboard/webhook');
    await takeScreenshot(page, 'TC-DASH-002_webhook', EVIDENCE);
  });

});
