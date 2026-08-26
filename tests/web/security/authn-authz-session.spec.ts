import { test, expect } from "@playwright/test";
import { BASE_URL, LOCKED_USER, VALID_PASS, VALID_USER, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

// TC-AUTH-004 — SC-AUTH-004 (High)
test("[TC-AUTH-004] Login user locked ditolak dengan pesan eksplisit", async ({ page }) => {
  await login(page, LOCKED_USER, VALID_PASS);
  const err = page.locator("[data-test='error']");
  await expect(err).toBeVisible();
  await expect(err).toContainText(/locked out/i);
  await expect(page).toHaveURL(`${BASE_URL}/`);
});

// TC-AUTH-005 — SC-AUTH-005 (High)
test("[TC-AUTH-005] SQL Injection pada form login ditolak", async ({ page }) => {
  test.setTimeout(120000);
  const payloads = [
    "' OR 1=1--",
    "' OR '1'='1",
    "admin'--",
    "1' UNION SELECT NULL--",
  ];
  for (const payload of payloads) {
    await login(page, payload, VALID_PASS);
    const err = page.locator("[data-test='error']");
    await expect(err).toBeVisible();
    const text = (await err.textContent()) ?? "";
    expect(text.toLowerCase()).not.toMatch(/sql|query|syntax|mysql|sqlite|postgres|exception/);
    await expect(page).toHaveURL(`${BASE_URL}/`);
  }
});

// TC-AUTH-006 — SC-AUTH-006 (High): sesi harus benar-benar mati setelah logout
test("[TC-AUTH-006] Setelah logout, tombol Back tidak membuka halaman internal", async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);

  await page.click("#react-burger-menu-btn");
  await page.click("#logout_sidebar_link");
  await expect(page).toHaveURL(`${BASE_URL}/`);

  // Coba kembali ke halaman internal via Back
  await page.goBack();
  // Konten internal tidak boleh terakses: harus tetap di login atau dialihkan ke login
  await expect(page.locator(".inventory_list")).toHaveCount(0);
  await expect(page.getByPlaceholder("Username")).toBeVisible();
});

// TC-AUTH-007 — SC-AUTH-007 (Low): sesi bertahan saat reload
 test("[TC-AUTH-007] Sesi dan state bertahan setelah reload", async ({ page }) => {
  await login(page);
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.reload();
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});

// TC-INV-005 — SC-INV-005 (High): akses langsung tanpa sesi harus ditolak
test("[TC-INV-005] Akses langsung /inventory.html tanpa login ditolak", async ({ page }) => {
  await page.goto(`${BASE_URL}/inventory.html`);
  // Tidak boleh melihat konten katalog
  await expect(page.locator(".inventory_list")).toHaveCount(0);
  // Harus berada kembali di halaman login dengan pesan penjelasan
  await expect(page).toHaveURL(new RegExp(`${BASE_URL.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}(/)?`));
  const err = page.locator("[data-test='error']");
  if (await err.isVisible().catch(() => false)) {
    await expect(err).toContainText(/logged in/i);
  }
  await expect(page.getByPlaceholder("Username")).toBeVisible();
});
