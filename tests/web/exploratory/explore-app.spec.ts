import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://ipos-dev.posindonesia.co.id';
const EVIDENCE_DIR = path.join(__dirname, '../../../evidence/discover');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

test.describe('Exploratory Testing — Ipos5', () => {

  test('01 — Halaman Login: screenshot & semua elemen', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '01_halaman_login.png'), fullPage: true });

    const title = await page.title();
    const url = page.url();
    console.log(`=== HALAMAN LOGIN ===`);
    console.log(`Title: ${title}`);
    console.log(`URL: ${url}`);

    // Ambil HTML login form
    const formHTML = await page.evaluate(() => {
      const form = document.querySelector('form');
      return form ? form.outerHTML.substring(0, 3000) : 'NO FORM FOUND';
    });
    console.log(`\nForm HTML:\n${formHTML}`);

    // Semua input
    const allInputs = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      return Array.from(inputs).map(i => ({
        type: i.type,
        name: i.name,
        id: i.id,
        placeholder: i.placeholder,
        class: i.className,
        visible: i.offsetParent !== null,
      }));
    });
    console.log(`\nAll inputs:`, JSON.stringify(allInputs, null, 2));

    // Semua button
    const allButtons = await page.evaluate(() => {
      const btns = document.querySelectorAll('button, [type="submit"]');
      return Array.from(btns).map(b => ({
        text: b.textContent?.trim(),
        type: b.getAttribute('type'),
        class: b.className,
      }));
    });
    console.log(`\nAll buttons:`, JSON.stringify(allButtons, null, 2));
  });

  test('02 — Login dengan kredensial', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Cari semua input, isi berdasarkan urutan/placeholder
    const inputs = await page.locator('input').all();
    console.log(`Input ditemukan: ${inputs.length}`);

    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const name = await inputs[i].getAttribute('name');
      const placeholder = await inputs[i].getAttribute('placeholder');
      console.log(`  Input[${i}]: type=${type}, name=${name}, placeholder=${placeholder}`);
    }

    // Isi berdasarkan name atau placeholder
    const nipposInput = page.locator('input[name="nippos"], input[placeholder*="NIPPOS"], input[placeholder*="nippos"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    const otpInput = page.locator('input[name="otp"], input[placeholder*="OTP"], input[placeholder*="otp"]').first();

    // Fallback: jika selector spesifik gagal, pakai nth
    if (await nipposInput.count() === 0 && inputs.length >= 3) {
      console.log('Fallback: menggunakan input berdasarkan urutan');
      await inputs[0].fill('994492078');
      await inputs[1].fill('$*Zemingho01');
      if (inputs.length >= 3) await inputs[2].fill('111111');
    } else {
      await nipposInput.fill('994492078');
      await passwordInput.fill('$*Zemingho01');
      if (await otpInput.count() > 0) await otpInput.fill('111111');
    }

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '02_form_terisi.png'), fullPage: true });

    // Klik tombol Masuk
    const masukBtn = page.locator('button:has-text("Masuk"), button[type="submit"]').first();
    if (await masukBtn.count() > 0) {
      await masukBtn.click();
    } else {
      // Fallback: tekan Enter
      const lastInput = inputs[inputs.length - 1];
      await lastInput.press('Enter');
    }

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    console.log(`\n=== SETELAH LOGIN ===`);
    console.log(`URL: ${page.url()}`);
    console.log(`Title: ${await page.title()}`);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '03_setelah_login.png'), fullPage: true });

    // Cek apakah masih di halaman login
    const stillLogin = page.url().includes('login');
    console.log(`Masih di login? ${stillLogin}`);

    if (!stillLogin) {
      // Kumpulkan semua navigasi
      const navLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href]');
        return Array.from(links).map(a => ({
          text: a.textContent?.trim().substring(0, 80) || '',
          href: a.getAttribute('href') || '',
          visible: a.offsetParent !== null,
        })).filter(l => l.text && l.visible);
      });
      console.log(`\nNavigasi: ${navLinks.length} items`);
      navLinks.forEach(n => console.log(`  "${n.text}" → ${n.href}`));

      // Simpan data
      fs.writeFileSync(
        path.join(EVIDENCE_DIR, 'navigation.json'),
        JSON.stringify({ url: page.url(), title: await page.title(), links: navLinks }, null, 2)
      );
    }
  });

  test('03 — Jelajahi halaman utama setelah login', async ({ page }) => {
    // Login
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const inputs = await page.locator('input').all();
    if (inputs.length >= 3) {
      await inputs[0].fill('994492078');
      await inputs[1].fill('$*Zemingho01');
      await inputs[2].fill('111111');
    }

    const masukBtn = page.locator('button:has-text("Masuk")').first();
    await masukBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    if (page.url().includes('login')) {
      console.log('LOGIN GAGAL — skip explorasi');
      return;
    }

    // Kumpulkan semua link dari halaman utama
    const allLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href]');
      return Array.from(links).map(a => ({
        text: a.textContent?.trim().substring(0, 100) || '',
        href: a.getAttribute('href') || '',
        visible: a.offsetParent !== null,
      })).filter(l => l.text && l.visible && l.href && !l.href.startsWith('javascript'));
    });

    console.log(`\n=== HALAMAN UTAMA ===`);
    console.log(`URL: ${page.url()}`);
    console.log(`Links: ${allLinks.length}`);

    const uniqueHrefs = new Map<string, string>();
    allLinks.forEach(l => {
      if (!uniqueHrefs.has(l.href)) uniqueHrefs.set(l.href, l.text);
    });

    console.log(`\nUnique pages:`);
    uniqueHrefs.forEach((text, href) => console.log(`  "${text}" → ${href}`));

    // Kunjungi halaman unik
    const hrefs = Array.from(uniqueHrefs.entries());
    const pageResults: any[] = [];

    for (let i = 0; i < Math.min(hrefs.length, 15); i++) {
      const [href, text] = hrefs[i];
      if (href === '#' || href === '/') continue;

      const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;

      try {
        await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(3000);

        const safeName = href.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
        await page.screenshot({ path: path.join(EVIDENCE_DIR, `04_${String(i+1).padStart(2,'0')}_${safeName}.png`), fullPage: true });

        const info = await page.evaluate(() => {
          const tables = document.querySelectorAll('table');
          const forms = document.querySelectorAll('form');
          const inputs = document.querySelectorAll('input:visible, select:visible, textarea:visible');
          const buttons = document.querySelectorAll('button:visible');
          const headings = document.querySelectorAll('h1, h2, h3');

          const tableHeaders: string[][] = [];
          tables.forEach(t => {
            const ths = t.querySelectorAll('th');
            tableHeaders.push(Array.from(ths).map(th => th.textContent?.trim() || ''));
          });

          return {
            title: document.title,
            tables: tables.length,
            forms: forms.length,
            inputs: inputs.length,
            buttons: buttons.length,
            headings: Array.from(headings).map(h => h.textContent?.trim().substring(0, 80) || ''),
            tableHeaders: tableHeaders.slice(0, 3),
          };
        });

        pageResults.push({ link: text, href, url: page.url(), ...info });

        console.log(`\n[${i+1}/${Math.min(hrefs.length,15)}] "${text}" → ${fullUrl}`);
        console.log(`  Title: ${info.title}`);
        console.log(`  Tables:${info.tables} Forms:${info.forms} Inputs:${info.inputs} Buttons:${info.buttons}`);
        if (info.headings.length) console.log(`  Headings: ${info.headings.join(' | ')}`);
        info.tableHeaders.forEach((h: string[]) => {
          if (h.length > 0) console.log(`  Table headers: ${h.join(' | ')}`);
        });
      } catch (e) {
        console.log(`[${i+1}] ERROR: ${fullUrl}`);
      }
    }

    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'pages-detail.json'),
      JSON.stringify({ totalUniquePages: hrefs.length, explored: pageResults.length, pages: pageResults }, null, 2)
    );
    console.log(`\nData disimpan ke evidence/discover/pages-detail.json`);
  });

});
