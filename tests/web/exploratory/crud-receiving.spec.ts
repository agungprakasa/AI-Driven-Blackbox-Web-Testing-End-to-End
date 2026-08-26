import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://ipos-dev.posindonesia.co.id';
const EVIDENCE = path.join(__dirname, '../../../evidence/crud');

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

test.describe('CRUD Testing — Receiving & Tracking', () => {

  test('01 — Receiving: buat paket baru (CREATE)', async ({ page }) => {
    await login(page);
    
    await page.goto(`${BASE_URL}/id/processing/receiving`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: path.join(EVIDENCE, '01_receiving_page.png'), fullPage: true });
    
    console.log(`=== RECEIVING PAGE ===`);
    console.log(`URL: ${page.url()}`);
    
    // Kumpulkan semua elemen
    const pageInfo = await page.evaluate(() => {
      const allInputs = document.querySelectorAll('input, select, textarea');
      const visibleInputs = Array.from(allInputs).filter((el: any) => el.offsetParent !== null && el.type !== 'hidden');
      
      const buttons = document.querySelectorAll('button');
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
          type: b.type || '',
          ariaLabel: b.getAttribute('aria-label') || '',
        })),
      };
    });
    
    console.log(`\nInputs: ${pageInfo.inputs.length}`);
    pageInfo.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} name="${inp.name}" placeholder="${inp.placeholder}" aria="${inp.ariaLabel}"`);
    });
    
    console.log(`\nButtons: ${pageInfo.buttons.length}`);
    pageInfo.buttons.forEach((btn: any) => {
      if (btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)) {
        console.log(`  - "${btn.text}" (type=${btn.type})`);
      }
    });
    
    // Cari tombol "Konfirmasi R7" atau tombol action lainnya
    const actionBtn = page.locator('button:has-text("Konfirmasi"), button:has-text("Tambah"), button:has-text("Buat"), button:has-text("Create")').first();
    
    if (await actionBtn.count() > 0) {
      const btnText = await actionBtn.textContent();
      console.log(`\nAction button ditemukan: "${btnText}"`);
      
      // Klik untuk buka form
      await actionBtn.click();
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: path.join(EVIDENCE, '01_form_receiving.png'), fullPage: true });
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
        }));
      });
      
      console.log(`\nForm elements: ${formElements.length}`);
      formElements.forEach((el: any, i: number) => {
        console.log(`  [${i}] ${el.tag} name="${el.name}" placeholder="${el.placeholder}" label="${el.label}"`);
      });
      
      fs.writeFileSync(path.join(EVIDENCE, 'receiving-form.json'), JSON.stringify(formElements, null, 2));
    }
  });

  test('02 — Reporting: lihat data paket yang ada (READ)', async ({ page }) => {
    await login(page);
    
    await page.goto(`${BASE_URL}/id/reporting/paket`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: path.join(EVIDENCE, '02_daftar_paket.png'), fullPage: true });
    
    // Ambil data lengkap dari tabel
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
      
      return { headers, rowCount: rows.length, data };
    });
    
    console.log(`=== DAFTAR PAKET (READ) ===`);
    if (tableData) {
      console.log(`Total rows: ${tableData.rowCount}`);
      
      // Cari kolom penting
      const connoteIdx = tableData.headers.findIndex(h => h.includes('connote_code'));
      const senderIdx = tableData.headers.findIndex(h => h.includes('sender_name'));
      const receiverIdx = tableData.headers.findIndex(h => h.includes('receiver_name'));
      const serviceIdx = tableData.headers.findIndex(h => h.includes('service_code'));
      const priceIdx = tableData.headers.findIndex(h => h.includes('total_price'));
      const statusIdx = tableData.headers.findIndex(h => h.includes('cod_status'));
      
      console.log(`\nData paket:`);
      tableData.data.slice(0, 5).forEach((row: any, i: number) => {
        console.log(`\n  [${i + 1}] Resi: ${row[connoteIdx]}`);
        console.log(`      Pengirim: ${row[senderIdx]}`);
        console.log(`      Penerima: ${row[receiverIdx]}`);
        console.log(`      Service: ${row[serviceIdx]}`);
        console.log(`      Harga: ${row[priceIdx]}`);
        console.log(`      Status: ${row[statusIdx]}`);
      });
      
      // Simpan data lengkap
      fs.writeFileSync(path.join(EVIDENCE, 'paket-data.json'), JSON.stringify(tableData, null, 2));
    }
  });

  test('03 — Tracking: lacak paket berdasarkan nomor resi', async ({ page }) => {
    await login(page);
    
    // Ambil nomor resi dari reporting
    await page.goto(`${BASE_URL}/id/reporting/paket`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const connoteCode = await page.evaluate(() => {
      const table = document.querySelector('table');
      if (!table) return null;
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
      const connoteIdx = headers.findIndex(h => h.includes('connote_code'));
      if (connoteIdx >= 0) {
        const firstRow = table.querySelector('tbody tr');
        if (firstRow) {
          const cells = Array.from(firstRow.querySelectorAll('td'));
          return cells[connoteIdx]?.textContent?.trim() || null;
        }
      }
      return null;
    });
    
    console.log(`=== TRACKING PAKET ===`);
    console.log(`Nomor resi: ${connoteCode}`);
    
    if (connoteCode) {
      // Buka tracking bag
      await page.goto(`${BASE_URL}/id/reporting/tracking/bag`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: path.join(EVIDENCE, '03_tracking_bag.png'), fullPage: true });
      
      // Kumpulkan semua input
      const inputs = await page.evaluate(() => {
        const allInputs = document.querySelectorAll('input');
        return Array.from(allInputs).filter((el: any) => el.offsetParent !== null && el.type !== 'hidden').map((el: any) => ({
          type: el.type,
          name: el.name || el.id || '',
          placeholder: el.placeholder || '',
          ariaLabel: el.getAttribute('aria-label') || '',
        }));
      });
      
      console.log(`\nInputs di halaman tracking:`);
      inputs.forEach((inp: any) => {
        console.log(`  type=${inp.type} name="${inp.name}" placeholder="${inp.placeholder}" aria="${inp.ariaLabel}"`);
      });
      
      // Coba isi input yang mungkin untuk search
      for (const inp of inputs) {
        if (inp.placeholder.toLowerCase().includes('cari') || 
            inp.placeholder.toLowerCase().includes('search') ||
            inp.placeholder.toLowerCase().includes('nomor') ||
            inp.placeholder.toLowerCase().includes('resi') ||
            inp.placeholder.toLowerCase().includes('bag') ||
            inp.ariaLabel.toLowerCase().includes('search')) {
          
          const searchEl = page.locator(`input[placeholder="${inp.placeholder}"], input[aria-label="${inp.ariaLabel}"]`).first();
          if (await searchEl.count() > 0) {
            console.log(`\nMencari dengan resi: ${connoteCode}`);
            await searchEl.fill(connoteCode);
            await searchEl.press('Enter');
            await page.waitForTimeout(3000);
            
            await page.screenshot({ path: path.join(EVIDENCE, '03_tracking_result.png'), fullPage: true });
            
            // Cek hasil
            const resultTable = await page.evaluate(() => {
              const table = document.querySelector('table');
              if (!table) return null;
              const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
              const rows = table.querySelectorAll('tbody tr');
              const data: any[] = [];
              rows.forEach((row) => {
                const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent?.trim() || '');
                data.push(cells);
              });
              return { headers, rowCount: rows.length, data: data.slice(0, 3) };
            });
            
            if (resultTable && resultTable.rowCount > 0) {
              console.log(`\nHasil tracking:`);
              console.log(`  Rows: ${resultTable.rowCount}`);
              console.log(`  Headers: ${resultTable.headers.join(' | ')}`);
              resultTable.data.forEach((row: any) => {
                console.log(`  Data: ${row.join(' | ')}`);
              });
            } else {
              console.log('Tidak ada hasil ditemukan');
            }
            
            break;
          }
        }
      }
      
      // Buka tracking events
      await page.goto(`${BASE_URL}/id/reporting/tracking/tracking-events`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: path.join(EVIDENCE, '03_tracking_events.png'), fullPage: true });
      
      // Kumpulkan data tracking events
      const eventsData = await page.evaluate(() => {
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
      
      if (eventsData) {
        console.log(`\n=== TRACKING EVENTS ===`);
        console.log(`Rows: ${eventsData.rowCount}`);
        console.log(`Headers: ${eventsData.headers.join(' | ')}`);
        eventsData.data.forEach((row: any, i: number) => {
          console.log(`  [${i}] ${row.join(' | ')}`);
        });
      }
    }
  });

  test('04 — Collecting: buat transaksi baru (CREATE)', async ({ page }) => {
    await login(page);
    
    // Buka halaman collecting beranda
    await page.goto(`${BASE_URL}/id/collecting`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: path.join(EVIDENCE, '04_collecting_beranda.png'), fullPage: true });
    
    console.log(`=== COLLECTING BERANDA ===`);
    console.log(`URL: ${page.url()}`);
    
    // Kumpulkan info halaman
    const pageInfo = await page.evaluate(() => {
      const allInputs = document.querySelectorAll('input, select, textarea');
      const visibleInputs = Array.from(allInputs).filter((el: any) => el.offsetParent !== null && el.type !== 'hidden');
      
      const buttons = document.querySelectorAll('button');
      const visibleButtons = Array.from(buttons).filter((b: any) => b.offsetParent !== null);
      
      return {
        inputs: visibleInputs.map((el: any) => ({
          tag: el.tagName,
          type: el.type || '',
          name: el.name || el.id || '',
          placeholder: el.placeholder || '',
        })),
        buttons: visibleButtons.map((b: any) => ({
          text: b.textContent?.trim().substring(0, 50) || '',
        })),
      };
    });
    
    console.log(`\nInputs: ${pageInfo.inputs.length}`);
    pageInfo.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} name="${inp.name}" placeholder="${inp.placeholder}"`);
    });
    
    // Cari tombol aksi di collecting
    const actionButtons = pageInfo.buttons.filter((btn: any) => 
      btn.text && !['Dashboard', 'Processing', 'Collecting', 'Referensi', 'Tarif', 'Reporting', 'Tracking', 'Operational', 'Tools', 'Finance', 'Modules', 'Settings', 'Account', 'Log Out'].includes(btn.text)
    );
    
    console.log(`\nAction buttons: ${actionButtons.length}`);
    actionButtons.forEach((btn: any) => {
      console.log(`  - "${btn.text}"`);
    });
    
    // Coba buka transaksi baru
    await page.goto(`${BASE_URL}/id/collecting/transaksi`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: path.join(EVIDENCE, '04_transaksi_page.png'), fullPage: true });
    
    // Kumpulkan semua elemen form
    const transaksiForm = await page.evaluate(() => {
      const allInputs = document.querySelectorAll('input, select, textarea');
      const visibleInputs = Array.from(allInputs).filter((el: any) => el.offsetParent !== null && el.type !== 'hidden');
      
      const buttons = document.querySelectorAll('button');
      const visibleButtons = Array.from(buttons).filter((b: any) => b.offsetParent !== null);
      
      return {
        inputs: visibleInputs.map((el: any) => ({
          tag: el.tagName,
          type: el.type || '',
          name: el.name || el.id || '',
          placeholder: el.placeholder || '',
          label: el.labels?.[0]?.textContent?.trim() || '',
        })),
        buttons: visibleButtons.map((b: any) => ({
          text: b.textContent?.trim().substring(0, 50) || '',
        })),
      };
    });
    
    console.log(`\n=== FORM TRANSAKSI ===`);
    console.log(`Inputs: ${transaksiForm.inputs.length}`);
    transaksiForm.inputs.forEach((inp: any, i: number) => {
      console.log(`  [${i}] ${inp.tag} type=${inp.type} name="${inp.name}" placeholder="${inp.placeholder}" label="${inp.label}"`);
    });
    
    fs.writeFileSync(path.join(EVIDENCE, 'transaksi-form-detail.json'), JSON.stringify(transaksiForm, null, 2));
  });

  test('05 — Rekap Harian: lihat rekap transaksi', async ({ page }) => {
    await login(page);
    
    await page.goto(`${BASE_URL}/id/collecting/rekap-harian`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: path.join(EVIDENCE, '05_rekap_harian.png'), fullPage: true });
    
    console.log(`=== REKAP HARIAN ===`);
    console.log(`URL: ${page.url()}`);
    
    // Kumpulkan data
    const pageInfo = await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      const tableData: any[] = [];
      
      tables.forEach((table) => {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
        const rows = table.querySelectorAll('tbody tr');
        const data: any[] = [];
        rows.forEach((row) => {
          const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent?.trim() || '');
          data.push(cells);
        });
        tableData.push({ headers, rowCount: rows.length, data: data.slice(0, 5) });
      });
      
      return { tables: tableData };
    });
    
    console.log(`\nTables: ${pageInfo.tables.length}`);
    pageInfo.tables.forEach((t: any, i: number) => {
      console.log(`\n  Table ${i + 1}: ${t.rowCount} rows`);
      console.log(`  Headers: ${t.headers.join(' | ')}`);
      t.data.forEach((row: any, j: number) => {
        console.log(`  [${j}] ${row.join(' | ')}`);
      });
    });
  });

});
