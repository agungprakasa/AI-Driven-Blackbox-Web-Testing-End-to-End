import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

// TC-CHK-007 — SC-CHK-007 (Medium): interupsi mid-checkout tidak boleh merusak alur
test("[TC-CHK-007] Refresh & back mid-checkout: alur tetap selesai benar", async ({ page }) => {
  await login(page);
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();
  await page.click(".shopping_cart_link");
  await page.click("[data-test='checkout']");

  await page.fill("[data-test='firstName']", "Budi");
  await page.fill("[data-test='lastName']", "Santoso");
  await page.fill("[data-test='postalCode']", "12345");
  await page.click("[data-test='continue']");
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

  // 1. Refresh di step-two
  await page.reload();
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  await expect(page.locator(".summary_total_label")).toBeVisible();

  // 2. Back ke step-one
  await page.goBack();
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);

  // 3. Lanjutkan sampai selesai — isi ulang form bila nilai tidak dipertahankan
  const firstVal = await page.inputValue("[data-test='firstName']");
  if (!firstVal) {
    await page.fill("[data-test='firstName']", "Budi");
    await page.fill("[data-test='lastName']", "Santoso");
    await page.fill("[data-test='postalCode']", "12345");
  }
  await page.click("[data-test='continue']");
  await page.click("[data-test='finish']");
  await expect(page.locator(".complete-header")).toHaveText("Thank you for your order!");

  // Tidak ada double-order: kembali ke inventory bersih
  await page.click("[data-test='back-to-products']");
  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
});
