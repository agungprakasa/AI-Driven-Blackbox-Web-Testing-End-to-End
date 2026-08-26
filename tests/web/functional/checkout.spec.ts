import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

async function addBackpackAndShirt(page: import("@playwright/test").Page) {
  // Seleksi berdasarkan nama produk agar stabil saat tombol berubah jadi Remove
  await page.locator(".inventory_item", { hasText: "Sauce Labs Backpack" })
    .getByRole("button", { name: "Add to cart" }).click();   // $29.99
  await page.locator(".inventory_item", { hasText: "Sauce Labs Bolt T-Shirt" })
    .getByRole("button", { name: "Add to cart" }).click();   // $15.99
  await page.click(".shopping_cart_link");
  await page.click("[data-test='checkout']");
}

// TC-CHK-001 — SC-CHK-001 (High)
test("[TC-CHK-001] Checkout sukses dengan data lengkap", async ({ page }) => {
  await login(page);
  await addBackpackAndShirt(page);

  await page.fill("[data-test='firstName']", "Budi");
  await page.fill("[data-test='lastName']", "Santoso");
  await page.fill("[data-test='postalCode']", "12345");
  await page.click("[data-test='continue']");
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

  await page.click("[data-test='finish']");
  await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
  await expect(page.locator(".complete-header")).toHaveText("Thank you for your order!");
});

// TC-CHK-002 — SC-CHK-002 (High): validasi field kosong berurutan
test("[TC-CHK-002] Validasi form kosong muncul berurutan per field", async ({ page }) => {
  await login(page);
  await addBackpackAndShirt(page);

  const err = page.locator("[data-test='error']");

  await page.click("[data-test='continue']");
  await expect(err).toContainText("First Name is required");

  await page.fill("[data-test='firstName']", "Budi");
  await page.click("[data-test='continue']");
  await expect(err).toContainText("Last Name is required");

  await page.fill("[data-test='lastName']", "Santoso");
  await page.click("[data-test='continue']");
  await expect(err).toContainText("Postal Code is required");

  // Tetap di step-one sampai lengkap
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
});

// TC-CHK-006 — SC-CHK-006 (Medium): Cancel di step-two membatalkan pesanan.
// PERHATIAN: perilaku aktual (terverifikasi black-box) = kembali ke /inventory.html,
// bukan /cart.html seperti asumsi awal di test-case.md. Ekspektasi dikoreksi.
test("[TC-CHK-006] Cancel pada step-two membatalkan pesanan dengan item utuh", async ({ page }) => {
  await login(page);
  await addBackpackAndShirt(page);

  await page.fill("[data-test='firstName']", "Budi");
  await page.fill("[data-test='lastName']", "Santoso");
  await page.fill("[data-test='postalCode']", "12345");
  await page.click("[data-test='continue']");
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

  await page.click("[data-test='cancel']");
  // Perilaku aktual: dialihkan ke inventory
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  // Item tidak hilang: masih ada di keranjang
  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");
  await page.click(".shopping_cart_link");
  await expect(page.locator(".cart_item")).toHaveCount(2);
});

// TC-CHK-005 — SC-CHK-005 (High): aritmetika ringkasan
test("[TC-CHK-005] Subtotal, tax, dan total dihitung benar", async ({ page }) => {
  await login(page);
  await addBackpackAndShirt(page);

  await page.fill("[data-test='firstName']", "Budi");
  await page.fill("[data-test='lastName']", "Santoso");
  await page.fill("[data-test='postalCode']", "12345");
  await page.click("[data-test='continue']");
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

  const parseUsd = (t: string | null) => Number((t ?? "").replace(/[^0-9.]/g, ""));
  const subtotal = parseUsd(await page.locator(".summary_subtotal_label").textContent());
  const tax = parseUsd(await page.locator(".summary_tax_label").textContent());
  const total = parseUsd(await page.locator(".summary_total_label").textContent());

  expect(subtotal).toBeCloseTo(45.98, 2);   // 29.99 + 15.99
  expect(total).toBeCloseTo(subtotal + tax, 2);
  const taxRate = tax / subtotal;
  expect(taxRate).toBeGreaterThan(0.05);
  expect(taxRate).toBeLessThan(0.12);       // pajak wajar ~8%
});
