import { defineConfig } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Baca konfigurasi dari config/test-config.env (jangan hardcode di sini)
function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    const raw = readFileSync(resolve(__dirname, "config/test-config.env"), "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2];
    }
  } catch {
    // test-config.env belum ada — gunakan default
  }
  return env;
}

const cfg = loadEnv();
const baseURL = process.env.APP_BASE_URL ?? cfg.APP_BASE_URL;
const headless = (process.env.HEADLESS ?? cfg.HEADLESS ?? "true") === "true";
const browser = process.env.BROWSER ?? cfg.BROWSER ?? "chromium";

export default defineConfig({
  testDir: "./tests/web",
  timeout: Number(cfg.DEFAULT_TIMEOUT ?? 30000),
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/playwright/html", open: "never" }],
    ["json", { outputFile: "reports/playwright/results.json" }],
  ],
  use: {
    baseURL,
    headless,
    browserName: ["chromium", "firefox", "webkit"].includes(browser)
      ? (browser as "chromium" | "firefox" | "webkit")
      : "chromium",
    viewport: {
      width: Number(cfg.VIEWPORT_WIDTH ?? 1920),
      height: Number(cfg.VIEWPORT_HEIGHT ?? 1080),
    },
    navigationTimeout: Number(cfg.NAVIGATION_TIMEOUT ?? 60000),
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    locale: "id-ID",
  },
  outputDir: "test-results",
});
