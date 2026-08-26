import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

// TC-CHK-004 — SC-CHK-004 (Medium): Equivalence Partitioning postalCode.
// Setiap kelas input diterapkan aturan konsisten; tidak boleh ada error internal.
// Setiap kelas dimulai dari state bersih (clear storage) agar independen.
test("[TC-CHK-004] Kelas input postalCode diperlakukan konsisten", async ({ page }) => {
  test.setTimeout(180000);
  await login(page);

  const kelas = [
    { nama: "angka-valid", nilai: "12345" },
    { nama: "huruf", nilai: "abcde" },
    { nama: "simbol-campur", nilai: "12@34" },
    { nama: "negatif", nilai: "-99999" },
  ];

  for (const k of kelas) {
    // State bersih tiap iterasi
    await page.goto(`${BASE_URL}/inventory.html`);
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload();
    await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);

    await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();
    await page.click(".shopping_cart_link");
    await page.click("[data-test='checkout']");

    await page.fill("[data-test='firstName']", "Budi");
    await page.fill("[data-test='lastName']", "Santoso");
    await page.fill("[data-test='postalCode']", k.nilai);
    await page.click("[data-test='continue']");
    await page.waitForTimeout(300);

    const lanjut = page.url().endsWith("/checkout-step-two.html");
    if (!lanjut) {
      // Jika ditolak, harus dengan pesan error aplikasi yang rapi
      await expect(page.locator("[data-test='error']")).toBeVisible();
    }
    // Tidak boleh error internal
    const body = ((await page.locator("body").textContent()) ?? "").toLowerCase();
    expect(body, `kelas ${k.nama}`).not.toMatch(/stack trace|exception|internal server error/);
  }
});
