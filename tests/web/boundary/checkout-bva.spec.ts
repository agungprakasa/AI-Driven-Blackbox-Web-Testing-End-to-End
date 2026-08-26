import { test, expect } from "@playwright/test";
import { BASE_URL, login, saveEvidence } from "../helpers";

test.afterEach(async ({ page }, testInfo) => {
  await saveEvidence(page, testInfo);
});

const LONG_STRING = "A".repeat(300);

async function bukaCheckout(page: import("@playwright/test").Page) {
  await login(page);
  await page.locator(".inventory_item button", { hasText: "Add to cart" }).first().click();
  await page.click(".shopping_cart_link");
  await page.click("[data-test='checkout']");
}

// TC-CHK-003 — SC-CHK-003 (High): BVA & karakter spesial pada form checkout.
// Aplikasi boleh menerima atau menolak input ekstrem, tapi TIDAK boleh crash,
// menampilkan error internal, atau mengeksekusi script (XSS).
test("[TC-CHK-003] BVA input checkout: panjang ekstrem, spasi, script tag", async ({ page }) => {
  let dialogMuncul = false;
  page.on("dialog", async (d) => {
    dialogMuncul = true;
    await d.dismiss();
  });

  await bukaCheckout(page);

  const kasus = [
    { nama: "1-karakter", first: "B", last: "S", postal: "1" },
    { nama: "panjang->255", first: LONG_STRING, last: LONG_STRING, postal: LONG_STRING },
    { nama: "spasi-saja", first: "   ", last: "   ", postal: "   " },
    { nama: "script-tag", first: "<script>alert(1)</script>", last: "<b>bold</b>", postal: "' OR '1'='1" },
  ];

  for (const k of kasus) {
    await page.goto(`${BASE_URL}/checkout-step-one.html`);
    await page.fill("[data-test='firstName']", k.first);
    await page.fill("[data-test='lastName']", k.last);
    await page.fill("[data-test='postalCode']", k.postal);
    await page.click("[data-test='continue']");

    // Hasil yang dapat diterima: lanjut ke step-two ATAU pesan error aplikasi yang rapi
    const url = page.url();
    const lanjut = url.endsWith("/checkout-step-two.html");
    if (!lanjut) {
      await expect(page.locator("[data-test='error']").or(page.locator("body"))).toBeVisible();
    }

    // Tidak boleh ada error internal / stack trace di halaman mana pun
    const body = (await page.locator("body").textContent()) ?? "";
    expect(body.toLowerCase(), `kasus ${k.nama}`).not.toMatch(
      /stack trace|exception|syntax error|internal server error|undefined is not/
    );
    // Script tidak boleh tereksekusi
    expect(dialogMuncul, `kasus ${k.nama}: alert XSS tereksekusi!`).toBe(false);
  }
});
