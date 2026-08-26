import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

// TC-DET-002 — SC-DET-002 (Medium): parameter id tidak valid tidak boleh membuat aplikasi crash
test("[TC-DET-002] Parameter id detail produk dengan nilai tidak valid", async ({ page }) => {
  test.setTimeout(120000);
  await login(page);

  for (const id of ["0", "-1", "abc", "99"]) {
    await page.goto(`${BASE_URL}/inventory-item.html?id=${id}`);
    await page.waitForTimeout(300);

    // Halaman harus tetap responsif — elemen dasar app ada
    await expect(page.locator("#react-burger-menu-btn")).toBeVisible();

    // Tidak boleh ada error internal / stack trace
    const body = ((await page.locator("body").textContent()) ?? "").toLowerCase();
    expect(body, `id=${id}`).not.toMatch(/stack trace|exception|syntax error|internal server error|undefined is not/);
  }
});
