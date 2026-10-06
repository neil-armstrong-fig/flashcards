import {vitestBaseConfig} from "@flashcards/shared/config/vitest.base.js";
import {defineConfig} from "vitest/config";

export default defineConfig({
  ...vitestBaseConfig,
  test: {...vitestBaseConfig.test, setupFiles: ["./src/testing/SetupWebappTests.ts"]},
  resolve: {tsconfigPaths: true},
});
