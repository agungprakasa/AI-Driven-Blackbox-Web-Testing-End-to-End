import { test, expect } from "@playwright/test";
import { BASE_URL, saveEvidence } from "../helpers";

// performance_glitch_user — bagian strategi abnormal (bukan TC bernomor):
// login lambat harus tetap berhasil dalam batas timeout yang wajar.
test("[PERF-001] performance_glitch_user tetap bisa login meski lambat", async ({ page }, testInfo) => {
  test.setTimeout(60000);
  const mulai = Date.now();

  await page.goto(`${BASE_URL}/`);
  await page.getByPlaceholder("Username").fill("performance_glitch_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.click("#login-button");

  await page.waitForURL("**/inventory.html", { timeout: 45000 });
  const durasi = Date.now() - mulai;
  console.log(`Login performance_glitch_user selesai dalam ${durasi} ms`);
  expect(durasi).toBeLessThan(45000);
  await expect(page.locator(".inventory_list")).toBeVisible();
});

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});
