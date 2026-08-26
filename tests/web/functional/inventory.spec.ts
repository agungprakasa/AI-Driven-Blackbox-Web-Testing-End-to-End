import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

const EXPECTED_PRODUCTS = [
  { name: "Sauce Labs Backpack", price: "$29.99" },
  { name: "Sauce Labs Bike Light", price: "$9.99" },
  { name: "Sauce Labs Bolt T-Shirt", price: "$15.99" },
  { name: "Sauce Labs Fleece Jacket", price: "$49.99" },
  { name: "Sauce Labs Onesie", price: "$7.99" },
  { name: "Test.allTheThings() T-Shirt (Red)", price: "$15.99" },
];

// TC-INV-001 — SC-INV-001 (High)
test("[TC-INV-001] Katalog menampilkan 6 produk lengkap", async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);

  const names = await page.locator(".inventory_item_name").allTextContents();
  const prices = await page.locator(".inventory_item_price").allTextContents();
  const descs = await page.locator(".inventory_item_desc").count();

  expect(names).toHaveLength(6);
  expect(descs).toBe(6);
  for (const p of EXPECTED_PRODUCTS) {
    expect(names).toContain(p.name);
    expect(prices[names.indexOf(p.name)]).toBe(p.price);
  }
});

// TC-INV-004 — SC-INV-004 (High)
test("[TC-INV-004] Add to cart memperbarui badge dan tombol menjadi Remove", async ({ page }) => {
  await login(page);

  // Produk pertama
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  await expect(
    page.locator(".inventory_item").first().locator("button", { hasText: "Remove" })
  ).toBeVisible();

  // Produk kedua
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

  // Kedua tombol kini Remove
  await expect(page.locator("button:has-text('Remove')")).toHaveCount(2);
});
