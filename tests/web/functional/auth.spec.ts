import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

// TC-AUTH-001 — SC-AUTH-001 (High)
test("[TC-AUTH-001] Login berhasil dengan kredensial valid", async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  await expect(page.locator(".inventory_list")).toBeVisible();
});

// TC-AUTH-002 — SC-AUTH-002 (High)
test("[TC-AUTH-002] Login gagal password salah tanpa bocoran info", async ({ page }) => {
  await login(page, "standard_user", "password_salah_123");
  await expect(page).toHaveURL(`${BASE_URL}/`);
  const err = page.locator("[data-test='error']");
  await expect(err).toBeVisible();
  const text = (await err.textContent()) ?? "";
  // Pesan jelas tapi tidak membocorkan detail internal (stack trace / SQL)
  expect(text.toLowerCase()).not.toMatch(/sql|exception|stack|syntax/);
});
