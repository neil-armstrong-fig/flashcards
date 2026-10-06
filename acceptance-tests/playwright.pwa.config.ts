import baseConfig, {PWA_SPECS} from "./playwright.config";
import {defineConfig, devices} from "@playwright/test";

/**
 * Service-worker behaviour against a compiled app (`pnpm start:preview`). The ordinary suite runs happily against Vite's
 * development server, where the production worker is deliberately absent; this one is separate so its browser sees the same
 * worker lifecycle as GitHub Pages.
 */
export default defineConfig({
  ...baseConfig,
  testIgnore: undefined,
  projects: [
    {
      name: "desktop-pwa",
      testMatch: PWA_SPECS,
      use: {...devices["Desktop Chrome"], reducedMotion: "reduce"},
    },
    {
      name: "mobile-pwa",
      testMatch: PWA_SPECS,
      use: {...devices["Pixel 5"], reducedMotion: "reduce"},
    },
  ],
});
