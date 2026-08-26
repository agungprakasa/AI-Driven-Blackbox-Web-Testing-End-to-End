import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

// TC-CART-003 — SC-CART-003 (Medium)
test("[TC-CART-003] Continue Shopping menjaga state keranjang", async ({ page }) => {
  await login(page);
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();
  await page.click(".shopping_cart_link");
  await page.click("[data-test='continue-shopping']");

  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});

// TC-CART-005 — SC-CART-005 (Low): item yang sama tidak boleh dobel aneh
test("[TC-CART-005] Item yang sudah di cart tidak terduplikasi", async ({ page }) => {
  await login(page);
  // Tambah Backpack dari inventory
  await page.locator(".inventory_item", { hasText: "Sauce Labs Backpack" })
    .getByRole("button", { name: "Add to cart" }).click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  // Buka detail produk yang sama — tombolnya kini Remove (tidak bisa dobel dari UI)
  await page.locator(".inventory_item_name", { hasText: "Sauce Labs Backpack" }).click();
  await expect(
    page.locator(".inventory_details button", { hasText: "Remove" })
  ).toHaveCount(1);
  await expect(
    page.locator(".inventory_details button", { hasText: "Add to cart" })
  ).toHaveCount(0);

  // Cart tetap satu baris untuk produk itu
  await page.click(".shopping_cart_link");
  await expect(page.locator(".cart_item")).toHaveCount(1);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});
