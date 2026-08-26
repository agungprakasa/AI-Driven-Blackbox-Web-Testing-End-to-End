import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

// TC-DET-001 — SC-DET-001 (Medium)
test("[TC-DET-001] Detail produk konsisten dengan katalog", async ({ page }) => {
  await login(page);
  const namaKatalog = (await page.locator(".inventory_item_name").first().textContent())!.trim();
  const hargaKatalog = (await page.locator(".inventory_item_price").first().textContent())!.trim();

  await page.locator(".inventory_item_name").first().click();
  await expect(page).toHaveURL(/inventory-item\.html/);

  const namaDetail = (await page.locator(".inventory_details_name").textContent())!.trim();
  const hargaDetail = (await page.locator(".inventory_details_price").textContent())!.trim();
  expect(namaDetail).toBe(namaKatalog);
  expect(hargaDetail).toBe(hargaKatalog);
});

// TC-DET-003 — SC-DET-003 (Medium): kembali dari detail tanpa kehilangan state
test("[TC-DET-003] Back to products menjaga state keranjang", async ({ page }) => {
  await login(page);
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.locator(".inventory_item_name").first().click();
  await page.click("[data-test='back-to-products']");
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});
