import {vitestBaseConfig} from "@flashcards/shared/config/vitest.base.js";
import {defineConfig} from "vitest/config";

/**
 * Plain node, not `@cloudflare/vitest-pool-workers`. What the Worker decides is kept in plain functions that take a `Request`
 * and read the things they reach out to (Azure, the counters) at the point of use, so they run under node's own Web-standard `Request` and
 * `Response`, with `fetch` stubbed and the bindings set on `workerEnvironment`. `cloudflare:workers` exists only inside the Workers runtime; under node it is a stub.
 */
export default defineConfig({
  ...vitestBaseConfig,
  test: {...vitestBaseConfig.test, setupFiles: ["./src/testing/SetupApiTests.ts"]},
  resolve: {
    tsconfigPaths: true,
    alias: {"cloudflare:workers": `${import.meta.dirname}/src/env/testing/CloudflareWorkersStub.ts`},
  },
});
