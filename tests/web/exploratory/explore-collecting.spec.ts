import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://ipos-dev.posindonesia.co.id';
const EVIDENCE = path.join(__dirname, '../../../evidence/deep-exploration');

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

test.describe('Deep Exploration — Collecting & Tracking (Fixed)', () => {

  test('01 — Explorasi form transaksi di Collecting', async ({ page }) => {
    await login(page);
    
    await page.goto(`${BASE_URL}/id/collecting/transaksi`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: path.join(EVIDENCE, '01_transaksi_page.png'), fullPage: true });
    
    // Kumpulkan semua elemen form (tanpa :visible selector)
    const formInfo = await page.evaluate(() => {
      const allInputs = document.querySelectorAll('input, select, textarea');
      const visibleInputs = Array.from(allInputs).filter((el: any) => {
        return el.offsetParent !== null && el.type !== 'hidden';
      });
      
      const buttons = document.querySelectorAll('button');
      const visibleButtons = Array.from(buttons).filter((b: any) => b.offsetParent !== null);
      
      const labels = document.querySelectorAll('label');
      
      return {
        inputs: visibleInputs.map((el: any) => ({
          tag: el.tagName,
          type: el.type || '',
          name: el.name || el.id || '',
          placeholder: el.placeholder || '',
          label: el.labels?.[0]?.textContent?.trim() || '',
          required: el.required,
        })),
        buttons: visibleButtons.map((b: any) => ({
          text: b.textContent?.trim().substring(0, 50) || '',
          type: b.type || '',
        })),
        labels: Array.from(labels).map((l: any) => l.textContent?.trim() || ''),
      };
    });
    
    console.log(`=== COLLECTING/TRANSAKSI ===`);
    console.log(`URL: ${page.url()}`);
    console.log(`\nInputs: ${formInfo.inputs.length}`);
    formInfo.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} name="${inp.name}" placeholder="${inp.placeholder}" label="${inp.label}"`);
    });
    
    console.log(`\nButtons: ${formInfo.buttons.length}`);
    formInfo.buttons.forEach((btn: any) => {
      console.log(`  - "${btn.text}"`);
    });
    
    fs.writeFileSync(path.join(EVIDENCE, 'transaksi-form.json'), JSON.stringify(formInfo, null, 2));
  });

  test('02 — Coba buat transaksi baru di Collecting', async ({ page }) => {
    await login(page);
    
    await page.goto(`${BASE_URL}/id/collecting/daftar-transaksi`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: path.join(EVIDENCE, '02_daftar_transaksi.png'), fullPage: true });
    
    // Cari tombol tambah/buat
    const allButtons = await page.evaluate(() => {
      const btns = document.querySelectorAll('button, a, [role="button"]');
      return Array.from(btns).filter((b: any) => b.offsetParent !== null).map((b: any) => ({
        text: b.textContent?.trim().substring(0, 50) || '',
        tag: b.tagName,
        href: b.getAttribute('href') || '',
      })).filter(b => b.text);
    });
    
    console.log(`=== DAFTAR TRANSAKSI ===`);
    console.log(`Buttons found: ${allButtons.length}`);
    allButtons.forEach((b: any) => {
      console.log(`  [${b.tag}] "${b.text}" href=${b.href}`);
    });
    
    // Coba klik tombol "Tambah" atau "Buat"
    const tambahBtn = page.locator('button:has-text("Tambah"), button:has-text("Buat"), button:has-text("Create"), a:has-text("Tambah"), a:has-text("Buat")').first();
    
    if (await tambahBtn.count() > 0) {
      const btnText = await tambahBtn.textContent();
      console.log(`\nMencoba klik: "${btnText}"`);
      await tambahBtn.click();
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: path.join(EVIDENCE, '02_form_transaksi_baru.png'), fullPage: true });
      console.log(`URL setelah klik: ${page.url()}`);
      
      // Kumpulkan form elements
      const formElements = await page.evaluate(() => {
        const allInputs = document.querySelectorAll('input, select, textarea');
        return Array.from(allInputs).filter((el: any) => el.offsetParent !== null && el.type !== 'hidden').map((el: any) => ({
          tag: el.tagName,
          type: el.type || '',
          name: el.name || el.id || '',
          placeholder: el.placeholder || '',
          label: el.labels?.[0]?.textContent?.trim() || '',
          required: el.required,
          options: el.tagName === 'SELECT' ? Array.from(el.options).map((o: any) => o.text).slice(0, 10) : undefined,
        }));
      });
      
      console.log(`\nForm elements: ${formElements.length}`);
      formElements.forEach((el: any, i: number) => {
        console.log(`  [${i}] ${el.tag} name="${el.name}" placeholder="${el.placeholder}" label="${el.label}"`);
        if (el.options) console.log(`       Options: ${el.options.join(', ')}`);
      });
      
      fs.writeFileSync(path.join(EVIDENCE, 'form-transaksi-baru.json'), JSON.stringify(formElements, null, 2));
    }
  });

  test('03 — Isi form transaksi dan submit (CRUD Create)', async ({ page }) => {
    await login(page);
    
    // Navigasi ke form transaksi baru
    await page.goto(`${BASE_URL}/id/collecting/transaksi`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Kumpulkan semua input yang ada
    const inputs = await page.locator('input').all();
    const visibleInputs: any[] = [];
    
    for (const inp of inputs) {
      if (await inp.isVisible()) {
        const type = await inp.getAttribute('type');
        const name = await inp.getAttribute('name');
        const placeholder = await inp.getAttribute('placeholder');
        visibleInputs.push({ element: inp, type, name, placeholder });
      }
    }
    
    console.log(`=== FORM TRANSAKSI ===`);
    console.log(`Visible inputs: ${visibleInputs.length}`);
    visibleInputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] type=${inp.type} name="${inp.name}" placeholder="${inp.placeholder}"`);
    });
    
    // Isi form dengan data test
    // Berdasarkan data yang ada di daftar paket, formatnya:
    // sender: nama, telepon, alamat, kode pos
    // receiver: nama, telepon, alamat, kode pos
    // service, berat, dll
    
    if (visibleInputs.length >= 4) {
      // Isi field pertama (biasanya nama pengirim)
      await visibleInputs[0].element.fill('Test Sender QA');
      
      // Isi field lainnya
      for (let i = 1; i < Math.min(visibleInputs.length, 10); i++) {
        const inp = visibleInputs[i];
        if (inp.type === 'number') {
          await inp.element.fill('1000');
        } else if (inp.type === 'tel' || inp.placeholder?.includes('telepon') || inp.placeholder?.includes('phone')) {
          await inp.element.fill('081234567890');
        } else if (inp.placeholder?.includes('alamat') || inp.placeholder?.includes('address')) {
          await inp.element.fill('Jl. Test No. 1');
        } else if (inp.placeholder?.includes('pos') || inp.placeholder?.includes('kode')) {
          await inp.element.fill('10310');
        } else if (inp.type === 'text') {
          await inp.element.fill('Test Data');
        }
      }
      
      await page.screenshot({ path: path.join(EVIDENCE, '03_form_terisi.png'), fullPage: true });
      
      // Cari dan klik tombol submit/simpan
      const submitBtn = page.locator('button[type="submit"], button:has-text("Simpan"), button:has-text("Submit"), button:has-text("Kirim"), button:has-text("Save")').first();
      
      if (await submitBtn.count() > 0) {
        console.log(`\nSubmit button ditemukan: ${await submitBtn.textContent()}`);
        await submitBtn.click();
        await page.waitForTimeout(5000);
        
        await page.screenshot({ path: path.join(EVIDENCE, '03_setelah_submit.png'), fullPage: true });
        console.log(`URL setelah submit: ${page.url()}`);
        
        // Cek apakah ada pesan sukses/error
        const pageText = await page.locator('body').textContent();
        if (pageText?.includes('berhasil') || pageText?.includes('success')) {
          console.log('✓ Transaksi berhasil dibuat!');
        } else if (pageText?.includes('error') || pageText?.includes('gagal')) {
          console.log('✗ Transaksi gagal');
        }
      }
    }
  });

  test('04 — Lihat data paket di Reporting (ada nomor resi)', async ({ page }) => {
    await login(page);
    
    await page.goto(`${BASE_URL}/id/reporting/paket`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: path.join(EVIDENCE, '04_daftar_paket.png'), fullPage: true });
    
    // Ambil data dari tabel
    const tableData = await page.evaluate(() => {
      const table = document.querySelector('table');
      if (!table) return null;
      
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
      const rows = table.querySelectorAll('tbody tr');
      const data: any[] = [];
      
      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent?.trim() || '');
        data.push(cells);
      });
      
      return { headers, rowCount: rows.length, data: data.slice(0, 5) };
    });
    
    console.log(`=== DAFTAR PAKET ===`);
    if (tableData) {
      console.log(`Rows: ${tableData.rowCount}`);
      console.log(`Headers: ${tableData.headers.join(' | ')}`);
      
      // Cari kolom connote_code (nomor resi)
      const resiIdx = tableData.headers.findIndex(h => h.includes('connote_code'));
      const transaksiIdx = tableData.headers.findIndex(h => h.includes('transaction_id'));
      
      if (resiIdx >= 0) {
        console.log(`\nNomor Resi (connote_code):`);
        tableData.data.forEach((row: any) => {
          console.log(`  ${row[resiIdx]}`);
        });
      }
      
      if (transaksiIdx >= 0) {
        console.log(`\nTransaction IDs:`);
        tableData.data.forEach((row: any) => {
          console.log(`  ${row[transaksiIdx]}`);
        });
      }
    }
  });

  test('05 — Tracking paket dengan nomor resi dari data', async ({ page }) => {
    await login(page);
    
    // Ambil nomor resi dari reporting/paket
    await page.goto(`${BASE_URL}/id/reporting/paket`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const connoteCode = await page.evaluate(() => {
      const table = document.querySelector('table');
      if (!table) return null;
      
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
      const resiIdx = headers.findIndex(h => h.includes('connote_code'));
      
      if (resiIdx >= 0) {
        const firstRow = table.querySelector('tbody tr');
        if (firstRow) {
          const cells = Array.from(firstRow.querySelectorAll('td'));
          return cells[resiIdx]?.textContent?.trim() || null;
        }
      }
      return null;
    });
    
    console.log(`=== TRACKING PAKET ===`);
    console.log(`Nomor resi: ${connoteCode}`);
    
    if (connoteCode) {
      // Buka halaman tracking
      await page.goto(`${BASE_URL}/id/reporting/tracking/bag`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: path.join(EVIDENCE, '05_tracking_page.png'), fullPage: true });
      
      // Cari input search/filter
      const searchInputs = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        return Array.from(inputs).filter((el: any) => el.offsetParent !== null).map((el: any) => ({
          type: el.type,
          name: el.name || el.id || '',
          placeholder: el.placeholder || '',
        }));
      });
      
      console.log(`\nSearch inputs: ${searchInputs.length}`);
      searchInputs.forEach((s: any) => {
        console.log(`  type=${s.type} name="${s.name}" placeholder="${s.placeholder}"`);
      });
      
      // Coba cari dengan nomor resi
      const searchInput = page.locator('input[type="search"], input[placeholder*="cari"], input[placeholder*="search"], input[placeholder*="Cari"], input[placeholder*="nomor"], input[placeholder*="resi"], input[placeholder*="Tracking"], input[placeholder*="bag"]').first();
      
      if (await searchInput.count() > 0) {
        console.log(`\nMencari dengan nomor resi: ${connoteCode}`);
        await searchInput.fill(connoteCode);
        await searchInput.press('Enter');
        await page.waitForTimeout(3000);
        
        await page.screenshot({ path: path.join(EVIDENCE, '05_tracking_result.png'), fullPage: true });
        
        // Cek hasil
        const resultText = await page.locator('body').textContent();
        console.log(`\nHasil pencarian:`);
        console.log(resultText?.substring(0, 500));
      } else {
        console.log('Search input tidak ditemukan di halaman tracking');
        
        // Coba tracking via URL
        await page.goto(`${BASE_URL}/id/reporting/tracking/bag-item`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        
        await page.screenshot({ path: path.join(EVIDENCE, '05_tracking_bag_item.png'), fullPage: true });
        console.log(`\nMencoba tracking via bag-item: ${page.url()}`);
      }
    }
  });

  test('06 — Explorasi semua halaman processing untuk CRUD', async ({ page }) => {
    await login(page);
    
    const pages = [
      { url: '/processing/receiving', name: 'Receiving' },
      { url: '/processing/bagging', name: 'Bagging' },
      { url: '/processing/manifest', name: 'Manifest' },
      { url: '/processing/handover', name: 'Hand Over' },
      { url: '/processing/loading', name: 'Loading' },
    ];
    
    for (const p of pages) {
      await page.goto(`${BASE_URL}/id${p.url}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      const safeName = p.name.replace(/[^a-zA-Z]/g, '_').toLowerCase();
      await page.screenshot({ path: path.join(EVIDENCE, `06_${safeName}.png`), fullPage: true });
      
      // Kumpulkan info halaman
      const info = await page.evaluate(() => {
        const tables = document.querySelectorAll('table');
        const buttons = document.querySelectorAll('button');
        const visibleButtons = Array.from(buttons).filter((b: any) => b.offsetParent !== null);
        const inputs = document.querySelectorAll('input');
        const visibleInputs = Array.from(inputs).filter((el: any) => el.offsetParent !== null && el.type !== 'hidden');
        
        return {
          tables: tables.length,
          buttons: visibleButtons.map((b: any) => b.textContent?.trim().substring(0, 30) || ''),
          inputs: visibleInputs.length,
          hasData: tables.length > 0 && document.querySelectorAll('table tbody tr').length > 0,
        };
      });
      
      console.log(`\n${p.name} (${p.url}):`);
      console.log(`  Tables: ${info.tables}, Inputs: ${info.inputs}`);
      console.log(`  Has data: ${info.hasData}`);
      console.log(`  Buttons: ${info.buttons.filter(b => b).join(', ')}`);
    }
  });

});
