import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://ipos-dev.posindonesia.co.id';
const EVIDENCE = path.join(__dirname, '../../../evidence/filters-downloads');

if (!fs.existsSync(EVIDENCE)) {
  fs.mkdirSync(EVIDENCE, { recursive: true });
}

async function login(page: any) {
  await page.goto(`${BASE_URL}/id/login`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  const inputs = await page.locator('input').all();
  if (inputs.length >= 3) {
    await inputs[0].fill('994492078');
    await inputs[1].fill('$*Zemingho01');
    await inputs[2].fill('111111');
  }
  await page.locator('button:has-text("Masuk")').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
}

async function getPageInfo(page: any) {
  return await page.evaluate(() => {
    const inputs = document.querySelectorAll('input, select');
    const visibleInputs = Array.from(inputs).filter((el: any) => el.offsetParent !== null && el.type !== 'hidden');
    
    const buttons = document.querySelectorAll('button, a[download], a[href*="download"], a[href*="export"]');
    const visibleButtons = Array.from(buttons).filter((b: any) => b.offsetParent !== null);
    
    return {
      inputs: visibleInputs.map((el: any) => ({
        tag: el.tagName,
        type: el.type || '',
        name: el.name || el.id || '',
        placeholder: el.placeholder || '',
        ariaLabel: el.getAttribute('aria-label') || '',
      })),
      buttons: visibleButtons.map((b: any) => ({
        text: b.textContent?.trim().substring(0, 50) || '',
        tag: b.tagName,
        href: b.getAttribute('href') || '',
        download: b.hasAttribute('download'),
      })),
    };
  });
}

// ===== REPORTING — Semua Halaman =====
test.describe('REPORTING — Filter & Download', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('REPORT-001: Daftar Paket — filter & download', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/paket`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-001_paket_page.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== DAFTAR PAKET ===`);
    console.log(`URL: ${page.url()}`);
    console.log(`\nInputs/Filter:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} name="${inp.name}" placeholder="${inp.placeholder}" aria="${inp.ariaLabel}"`);
    });
    console.log(`\nButtons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}" download=${btn.download}`);
      }
    });

    // Coba filter: isi search
    const searchInput = page.locator('input[placeholder*="cari"], input[placeholder*="search"], input[placeholder*="Cari"], input[aria-label*="search"], input[aria-label*="Search"]').first();
    if (await searchInput.count() > 0) {
      console.log(`\nMencoba filter search...`);
      await searchInput.fill('40000178773792401');
      await searchInput.press('Enter');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-001_paket_filtered.png'), fullPage: true });
      
      const rows = await page.locator('table tbody tr').count();
      console.log(`Hasil filter: ${rows} rows`);
    }

    // Coba filter tanggal
    const dateInputs = page.locator('input[type="date"]');
    const dateCount = await dateInputs.count();
    if (dateCount >= 2) {
      console.log(`\nMencoba filter tanggal...`);
      await dateInputs.first().fill('2026-08-01');
      await dateInputs.last().fill('2026-08-31');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-001_paket_date_filter.png'), fullPage: true });
    }

    // Cari tombol download/export
    const downloadBtn = page.locator('button:has-text("Download"), button:has-text("Export"), button:has-text("Unduh"), a:has-text("Download"), a:has-text("Export")').first();
    if (await downloadBtn.count() > 0) {
      console.log(`\nTombol download ditemukan: ${await downloadBtn.textContent()}`);
    }
  });

  test('REPORT-002: Daftar Bag — filter & download', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/bag`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-002_bag_page.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== DAFTAR BAG ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}" aria="${inp.ariaLabel}"`);
    });
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}" download=${btn.download}`);
      }
    });
  });

  test('REPORT-003: Tracking Bag — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/tracking/bag`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-003_tracking_bag.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== TRACKING BAG ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}" aria="${inp.ariaLabel}"`);
    });

    // Coba filter dengan berbagai input
    const allInputs = await page.locator('input').all();
    for (let i = 0; i < allInputs.length; i++) {
      const isVisible = await allInputs[i].isVisible();
      const type = await allInputs[i].getAttribute('type');
      const placeholder = await allInputs[i].getAttribute('placeholder');
      
      if (isVisible && type !== 'hidden' && placeholder !== 'Find page...') {
        console.log(`\nMencoba input[${i}]: type=${type} placeholder="${placeholder}"`);
        
        if (type === 'text') {
          await allInputs[i].fill('PID985AD2392');
          await allInputs[i].press('Enter');
          await page.waitForTimeout(2000);
          await page.screenshot({ path: path.join(EVIDENCE, `REPORT-003_tracking_bag_filter_${i}.png`), fullPage: true });
          
          const rows = await page.locator('table tbody tr').count();
          console.log(`  Hasil: ${rows} rows`);
        } else if (type === 'date') {
          await allInputs[i].fill('2026-08-01');
          await page.waitForTimeout(1000);
        } else if (type === 'number') {
          await allInputs[i].fill('1');
          await allInputs[i].press('Enter');
          await page.waitForTimeout(2000);
        }
      }
    }
  });

  test('REPORT-004: Tracking Bag Item — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/tracking/bag-item`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-004_tracking_bag_item.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== TRACKING BAG ITEM ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}" aria="${inp.ariaLabel}"`);
    });
  });

  test('REPORT-005: Tracking Events — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/tracking/tracking-events`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-005_tracking_events.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== TRACKING EVENTS ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}" aria="${inp.ariaLabel}"`);
    });

    // Coba filter tanggal
    const dateInputs = page.locator('input[type="date"]');
    if (await dateInputs.count() >= 2) {
      console.log(`\nFilter tanggal...`);
      await dateInputs.first().fill('2026-08-01');
      await dateInputs.last().fill('2026-08-31');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-005_events_date_filter.png'), fullPage: true });
    }
  });

  test('REPORT-006: Daftar Kedatangan — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/kedatangan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-006_kedatangan.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== DAFTAR KEDATANGAN ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}"`);
      }
    });
  });

  test('REPORT-007: Daftar Angkutan — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/angkutan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-007_angkutan.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== DAFTAR ANGKUTAN ===`);
    console.log(`Inputs: ${info.inputs.length}`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

  test('REPORT-008: Operational Loading — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/operational/loading`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-008_loading.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== LOADING ===`);
    console.log(`Inputs: ${info.inputs.length}`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}"`);
      }
    });
  });

  test('REPORT-009: Laporan Keuangan — filter & download', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/keuangan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-009_keuangan.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== LAPORAN KEUANGAN ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}" download=${btn.download}`);
      }
    });
  });

  test('REPORT-010: Komisi Agenpos — filter & download', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/komisi`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-010_komisi.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== KOMISI AGENPOS ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}" download=${btn.download}`);
      }
    });
  });

  test('REPORT-011: Manifest R7 — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/reporting/manifest`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REPORT-011_manifest.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== MANIFEST R7 ===`);
    console.log(`Inputs: ${info.inputs.length}`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

  test('REPORT-012: Tools — Unbagging, Pre-Bagging, dll', async ({ page }) => {
    const tools = [
      { url: '/reporting/tools/unbagging', name: 'Unbagging' },
      { url: '/reporting/tools/unbagging-item', name: 'Unbagging Item' },
      { url: '/reporting/tools/pre-bagging', name: 'Pre-Bagging' },
      { url: '/reporting/tools/manifest-r7', name: 'Manifest R7' },
      { url: '/reporting/tools/irregularity', name: 'Irregularity' },
    ];

    for (const tool of tools) {
      await page.goto(`${BASE_URL}/id${tool.url}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const safeName = tool.name.replace(/[^a-zA-Z]/g, '_').toLowerCase();
      await page.screenshot({ path: path.join(EVIDENCE, `REPORT-012_${safeName}.png`), fullPage: true });

      const info = await getPageInfo(page);
      console.log(`\n=== ${tool.name} ===`);
      console.log(`URL: ${page.url()}`);
      console.log(`Inputs: ${info.inputs.length}`);
      info.inputs.forEach((inp: any, i: number) => {
        console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
      });
    }
  });

});

// ===== PROCESSING — Filter =====
test.describe('PROCESSING — Filter', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('PROC-001: Receiving — filter & scan R7', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/processing/receiving`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'PROC-001_receiving.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== RECEIVING ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });

    // Coba scan R7
    const r7Input = page.locator('input[placeholder*="R7"], input[placeholder*="scan"]').first();
    if (await r7Input.count() > 0) {
      console.log(`\nMencoba scan R7...`);
      await r7Input.fill('40000178773792401');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(EVIDENCE, 'PROC-001_receiving_scan.png'), fullPage: true });
    }
  });

  test('PROC-002: Bagging — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/processing/bagging`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'PROC-002_bagging.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== BAGGING ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}"`);
      }
    });
  });

  test('PROC-003: Manifest — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/processing/manifest`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'PROC-003_manifest.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== MANIFEST ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

  test('PROC-004: Loading — filter (Pending/Scanned/Berangkat)', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/processing/loading`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'PROC-004_loading.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== LOADING ===`);
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}"`);
      }
    });

    // Klik tab Pending/Scanned/Berangkat
    for (const tab of ['Pending', 'Scanned', 'Berangkat']) {
      const tabBtn = page.locator(`button:has-text("${tab}")`).first();
      if (await tabBtn.count() > 0) {
        console.log(`\nKlik tab "${tab}"...`);
        await tabBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(EVIDENCE, `PROC-004_loading_${tab.toLowerCase()}.png`), fullPage: true });
      }
    }
  });

  test('PROC-005: Unloading — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/processing/unloading`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'PROC-005_unloading.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== UNLOADING ===`);
    console.log(`Inputs: ${info.inputs.length}`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

});

// ===== COLLECTING — Filter =====
test.describe('COLLECTING — Filter', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('COLL-001: Daftar Transaksi — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/collecting/daftar-transaksi`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'COLL-001_daftar_transaksi.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== DAFTAR TRANSAKSI ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}"`);
      }
    });
  });

  test('COLL-002: Backsheet — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/collecting/backsheet`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'COLL-002_backsheet.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== BACKSHEET ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

  test('COLL-003: Rekap Harian — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/collecting/rekap-harian`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'COLL-003_rekap_harian.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== REKAP HARIAN ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

  test('COLL-004: Audit Koreksi — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/collecting/audit-koreksi`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'COLL-004_audit_koreksi.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== AUDIT KOREKSI ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

  test('COLL-005: Pembatalan — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/collecting/pembatalan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'COLL-005_pembatalan.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== PEMBATALAN ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

});

// ===== SETTINGS — Filter =====
test.describe('SETTINGS — Filter', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('SETT-001: User Management — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/settings/user`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'SETT-001_user.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== USER MANAGEMENT ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}"`);
      }
    });
  });

  test('SETT-002: Role Management — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/settings/role`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'SETT-002_role.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== ROLE MANAGEMENT ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

  test('SETT-003: Location Management — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/settings/location`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'SETT-003_location.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== LOCATION MANAGEMENT ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

  test('SETT-004: Permission Management — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/settings/permission`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'SETT-004_permission.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== PERMISSION MANAGEMENT ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

});

// ===== REFERENCING — Hitung Tarif =====
test.describe('REFERENCING — Hitung Tarif', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('REF-001: Hitung Tarif — form & kalkulasi', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/referencing/tarif/calculate`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'REF-001_hitung_tarif.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== HITUNG TARIF ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
    console.log(`Buttons:`);
    info.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}"`);
      }
    });
  });

});

// ===== MODULES — Irregularity & COD Recon =====
test.describe('MODULES — Filter', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('MODL-001: Irregularity — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/modules/irregularity`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'MODL-001_irregularity.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== IRREGULARITY ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

  test('MODL-002: COD Recon — filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/id/modules/cod-recon`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(EVIDENCE, 'MODL-002_cod_recon.png'), fullPage: true });

    const info = await getPageInfo(page);
    console.log(`=== COD RECON ===`);
    console.log(`Inputs:`);
    info.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} placeholder="${inp.placeholder}"`);
    });
  });

});
