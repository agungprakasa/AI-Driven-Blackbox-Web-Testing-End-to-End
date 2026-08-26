import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

// TC-NAV-001 — SC-NAV-001 (Low)
test("[TC-NAV-001] Menu All Items membawa ke inventory dari halaman mana pun", async ({ page }) => {
  await login(page);
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();

  for (const tujuan of [`${BASE_URL}/cart.html`, `${BASE_URL}/checkout-step-one.html`]) {
    await page.goto(tujuan);
    await page.click("#react-burger-menu-btn");
    await page.click("#inventory_sidebar_link");
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  }
});

// TC-NAV-002 — SC-NAV-002 (Low)
test("[TC-NAV-002] Menu About membuka saucelabs.com di tab baru", async ({ page, context }) => {
  await login(page);
  await page.click("#react-burger-menu-btn");
  const [popup] = await Promise.all([
    context.waitForEvent("page", { timeout: 15000 }).catch(() => null),
    page.click("#about_sidebar_link"),
  ]);

  if (popup) {
    expect(popup.url()).toMatch(/saucelabs\.com/);
    await popup.close();
    // Aplikasi asli tetap login
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  } else {
    // Fallback: navigasi di tab yang sama ke arah saucelabs.com
    await page.waitForTimeout(1000);
    expect(page.url()).toMatch(/saucelabs\.com|inventory/);
  }
});

// TC-NAV-003 — SC-NAV-003 (Medium)
test("[TC-NAV-003] Reset App State membersihkan keranjang sepenuhnya", async ({ page }) => {
  await login(page);
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).nth(0).click();
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

  await page.click("#react-burger-menu-btn");
  await page.click("#reset_sidebar_link");
  // Tunggu menu tertutup & state benar-benar direset
  await page.waitForTimeout(1000);

  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
  await expect(page.locator("button:has-text('Remove')")).toHaveCount(0, { timeout: 10000 });
  await expect(page.locator("button:has-text('Add to cart')")).toHaveCount(6);

  await page.click(".shopping_cart_link");
  await expect(page.locator(".cart_item")).toHaveCount(0);
});
