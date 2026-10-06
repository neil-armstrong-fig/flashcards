import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import {VitePWA} from "vite-plugin-pwa";

/**
 * The app is always served from the root of its own (sub)domain, so there is no base path to configure.
 * `start_url` and `scope` follow it.
 */
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: "build",
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: false,
      registerType: "prompt",
      strategies: "injectManifest",
      srcDir: "src/sw",
      filename: "ServiceWorker.ts",
      injectManifest: {
        // No recordings: they are served to a signed-in learner by the API and kept on the device as they are played
        // (`docs/online.md`, `src/redux/shared/audio/BrowserRecordingKeeper.ts`).
        globPatterns: ["**/*.{js,css,html,svg,png,txt}"],
      },
      includeAssets: ["icon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"],
      manifest: {
        id: "/",
        name: "Flash Cards",
        short_name: "Flash Cards",
        description: "Spaced-repetition language study with audio, streaks and memory aids. Works offline.",
        lang: "en",
        dir: "ltr",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          {src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any"},
          {src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any"},
          {src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any"},
          {src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable"},
        ],
        categories: ["education"],
      },
    }),
  ],
});
