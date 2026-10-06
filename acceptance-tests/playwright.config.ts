import {defineConfig, devices} from "@playwright/test";

/**
 * Which deployment the acceptance tests drive. The package scripts set this: there is no notion
 * of an "environment" in the tests themselves, only a URL.
 */
const webappUrl = process.env["WEBAPP_URL"] ?? "http://localhost:3000";

/**
 * Service-worker behaviour (going offline, taking a new release), which needs a compiled build: the development server
 * deliberately does not register the app's production worker. `playwright.pwa.config.ts` runs these against preview.
 */
export const PWA_SPECS = "**/pwa/**";

const isCi = !!process.env["CI"];

export default defineConfig({
  testDir: "./src/tests",
  testIgnore: PWA_SPECS,
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  // Two per four-vCPU runner is as far as the 5s action and expect timeouts stay steady; the CI
  // workflow gets its speed by sharding the suite across runners instead.
  workers: isCi ? 2 : undefined,
  reporter: isCi ? [["github"], ["html", {open: "never"}]] : [["list"]],
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: webappUrl,
    actionTimeout: 5_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {...devices["Desktop Chrome"], reducedMotion: "reduce"},
    },
    // A real touch viewport, so tap targets and layout are covered on every run.
    {
      name: "mobile",
      use: {...devices["Pixel 5"], reducedMotion: "reduce"},
    },
  ],
});
