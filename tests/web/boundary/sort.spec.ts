import { test, expect } from "@playwright/test";
import { login, saveEvidence } from "../helpers";

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

const ambilNama = async (page: import("@playwright/test").Page) =>
  (await page.locator(".inventory_item_name").allTextContents()).map((s) => s.trim());
const ambilHarga = async (page: import("@playwright/test").Page) =>
  (await page.locator(".inventory_item_price").allTextContents()).map((s) => Number(s.replace(/[^0-9.]/g, "")));

// TC-INV-002 — SC-INV-002 (Medium)
test("[TC-INV-002] Sortir nama A-Z dan Z-A benar", async ({ page }) => {
  const pilih = page.locator("[data-test='product-sort-container']");

  await pilih.selectOption("az");
  const asc = await ambilNama(page);
  expect(asc).toEqual([...asc].sort((a, b) => a.localeCompare(b)));

  await pilih.selectOption("za");
  const desc = await ambilNama(page);
  expect(desc).toEqual([...desc].sort((a, b) => b.localeCompare(a)));
  expect(desc).toEqual([...asc].reverse());
});

// TC-INV-003 — SC-INV-003 (Medium)
test("[TC-INV-003] Sortir harga low-high dan high-low benar secara numerik", async ({ page }) => {
  const pilih = page.locator("[data-test='product-sort-container']");

  await pilih.selectOption("lohi");
  const asc = await ambilHarga(page);
  expect(asc).toEqual([...asc].sort((a, b) => a - b));

  await pilih.selectOption("hilo");
  const desc = await ambilHarga(page);
  expect(desc).toEqual([...desc].sort((a, b) => b - a));
});
