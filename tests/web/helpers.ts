import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Page, TestInfo } from "@playwright/test";

/** Baca config/test-config.env — jangan hardcode kredensial di spec. */
export function loadTestConfig(): Record<string, string> {
  try {
    const raw = readFileSync(resolve(__dirname, "../../config/test-config.env"), "utf-8");
    const cfg: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) cfg[m[1]] = m[2];
    }
    return cfg;
  } catch {
    return {};
  }
}

export const cfg = loadTestConfig();
export const BASE_URL = (process.env.APP_BASE_URL || cfg.APP_BASE_URL || "https://www.saucedemo.com").replace(/\/+$/, "");
export const VALID_USER = cfg.TEST_USER_REGULAR || "standard_user";
export const VALID_PASS = cfg.TEST_PASSWORD || "";
export const LOCKED_USER = "locked_user";

/** Login via UI. Tanpa argumen = akun valid dari test-config.env */
export async function login(page: Page, user = VALID_USER, pass = VALID_PASS): Promise<void> {
  await page.goto(`${BASE_URL}/`);
  await page.getByPlaceholder("Username").fill(user);
  await page.getByPlaceholder("Password").fill(pass);
  await page.click("#login-button");
}

/**
 * Simpan screenshot evidence sesuai konvensi template.
 * Panggil di afterEach; nama file diambil dari [TC-XXX-NNN] pada judul test.
 * PASS -> evidence/PASS/, selain itu -> evidence/FAIL/
 */
export async function saveEvidence(page: Page, testInfo: TestInfo): Promise<void> {
  const m = testInfo.title.match(/\[(TC-[A-Z0-9]+-\d{3}|CH-\d{2})\]/);
  const id = m ? m[1] : `UNKNOWN-${Date.now()}`;
  const dir = testInfo.status === "passed" ? "PASS" : "FAIL";
  const slug = testInfo.title.replace(/\[[^\]]+\]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 50).toLowerCase();
  const file = resolve(__dirname, `../../evidence/${dir}/${id}_${slug}.png`);
  await page.screenshot({ path: file, fullPage: false }).catch(() => {});
}
