import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

async function journeyBelanja(page: import("@playwright/test").Page, jumlahItem: number) {
  await login(page);
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);

  for (let i = 0; i < jumlahItem; i++) {
    // Selalu klik tombol Add pertama yang tersedia (urutan produk tetap dari atas)
    await page.locator("button:has-text('Add to cart')").first().click();
  }
  await expect(page.locator(".shopping_cart_badge")).toHaveText(String(jumlahItem));

  await page.click(".shopping_cart_link");
  await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
  await expect(page.locator(".cart_item")).toHaveCount(jumlahItem);

  await page.click("[data-test='checkout']");
  await page.fill("[data-test='firstName']", "Budi");
  await page.fill("[data-test='lastName']", "Santoso");
  await page.fill("[data-test='postalCode']", "12345");
  await page.click("[data-test='continue']");
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

  await page.click("[data-test='finish']");
  await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
  await expect(page.locator(".complete-header")).toHaveText("Thank you for your order!");
}

// TC-E2E-001 — SC-E2E-001 (High)
test("[TC-E2E-001] Journey belanja penuh dengan 2 produk", async ({ page }) => {
  await journeyBelanja(page, 2);
});

// TC-E2E-002 — SC-E2E-002 (High): multi-item + verifikasi aritmetika tiap tahap
test("[TC-E2E-002] Journey multi-item dengan verifikasi total", async ({ page }) => {
  await login(page);

  // Tambah semua produk dan pastikan harga tercatat dari UI
  const tombol = page.locator("button:has-text('Add to cart')");
  const n = await tombol.count();
  const hargaKatalog = await page.locator(".inventory_item_price").allTextContents();
  const toNum = (s: string) => Number(s.replace(/[^0-9.]/g, ""));
  const expectedSubtotal = hargaKatalog.reduce((a, h) => a + toNum(h), 0);

  for (let i = 0; i < n; i++) await tombol.first().click();
  await page.click(".shopping_cart_link");

  // Verifikasi di tahap cart
  const hargaCart = await page.locator(".inventory_item_price").allTextContents();
  expect(hargaCart.map(toNum).reduce((a, b) => a + b, 0)).toBeCloseTo(expectedSubtotal, 2);

  await page.click("[data-test='checkout']");
  await page.fill("[data-test='firstName']", "Budi");
  await page.fill("[data-test='lastName']", "Santoso");
  await page.fill("[data-test='postalCode']", "12345");
  await page.click("[data-test='continue']");

  // Verifikasi aritmetika di step two
  const parse = async (sel: string) =>
    Number(((await page.locator(sel).textContent()) ?? "").replace(/[^0-9.]/g, ""));
  const subtotal = await parse(".summary_subtotal_label");
  const tax = await parse(".summary_tax_label");
  const total = await parse(".summary_total_label");

  expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
  expect(total).toBeCloseTo(subtotal + tax, 2);

  await page.click("[data-test='finish']");
  await expect(page.locator(".complete-header")).toHaveText("Thank you for your order!");
});
