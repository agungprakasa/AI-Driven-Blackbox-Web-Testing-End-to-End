import { test, expect } from "@playwright/test";
import { BASE_URL, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

const loginPage = (page: import("@playwright/test").Page) => page.goto(`${BASE_URL}/`);

// TC-AUTH-003 — SC-AUTH-003 (Medium): validasi field kosong berurutan
test("[TC-AUTH-003] Login dengan field kosong memberi pesan spesifik", async ({ page }) => {
  await loginPage(page);
  const err = page.locator("[data-test='error']");

  // Semua kosong
  await page.click("#login-button");
  await expect(err).toContainText("Username is required");

  // Username saja
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.click("#login-button");
  await expect(err).toContainText("Password is required");

  // Tetap di halaman login
  await expect(page).toHaveURL(`${BASE_URL}/`);
});

// TC-CART-004 — SC-CART-004 (Medium): cart kosong tidak boleh crash
test("[TC-CART-004] Cart dalam kondisi kosong tampil wajar", async ({ page }) => {
  // Login lalu langsung ke cart tanpa menambah apa pun
  await page.goto(`${BASE_URL}/`);
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill(process.env.CI ? "secret_sauce" : "secret_sauce");
  await page.click("#login-button");
  await page.goto(`${BASE_URL}/cart.html`);

  await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
  await expect(page.locator(".cart_item")).toHaveCount(0);
  // Tombol Checkout tetap ada dan aplikasi responsif
  await expect(page.locator("[data-test='checkout']")).toBeVisible();
});
