import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

async function addByName(page: import("@playwright/test").Page, nama: string) {
  // Seleksi berdasarkan nama produk agar stabil saat tombol berubah jadi Remove
  await page.locator(".inventory_item", { hasText: nama })
    .getByRole("button", { name: "Add to cart" }).click();
}

async function addTwoProducts(page: import("@playwright/test").Page) {
  await addByName(page, "Sauce Labs Backpack");      // $29.99
  await addByName(page, "Sauce Labs Bolt T-Shirt");  // $15.99
}

// TC-CART-001 — SC-CART-001 (High)
test("[TC-CART-001] Item tampil benar di cart dengan nama, harga, badge", async ({ page }) => {
  await login(page);
  await addTwoProducts(page);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

  await page.click(".shopping_cart_link");
  await expect(page).toHaveURL(`${BASE_URL}/cart.html`);

  const names = await page.locator(".inventory_item_name").allTextContents();
  const prices = await page.locator(".inventory_item_price").allTextContents();

  expect(names).toEqual(["Sauce Labs Backpack", "Sauce Labs Bolt T-Shirt"]);
  expect(prices).toEqual(["$29.99", "$15.99"]);
  await expect(page.locator(".cart_quantity")).toHaveText(["1", "1"]);
});

// TC-CART-002 — SC-CART-002 (High)
test("[TC-CART-002] Remove item dari cart memperbarui daftar dan badge", async ({ page }) => {
  await login(page);
  await addTwoProducts(page);
  await page.click(".shopping_cart_link");

  await page.locator(".cart_item button", { hasText: "Remove" }).first().click();

  await expect(page.locator(".cart_item")).toHaveCount(1);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  const remaining = await page.locator(".inventory_item_name").textContent();
  expect(remaining).toBe("Sauce Labs Bolt T-Shirt");

  // Tombol produk yang diremove kembali menjadi Add to cart di inventory
  await page.click("[data-test='continue-shopping']");
  await expect(
    page.locator(".inventory_item").first().locator("button", { hasText: "Add to cart" })
  ).toBeVisible();
});
