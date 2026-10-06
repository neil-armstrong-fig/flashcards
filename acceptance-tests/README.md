# acceptance-tests

The Playwright specs, and the DSL that drives the app so a spec reads as a sentence (`webApp.review.rate("good")`). A spec never touches a locator, and this package may not import `webapp`, so no expectation is recomputed from the code under test.

Imports `shared` only. Run with `pnpm start:preview` then `pnpm acceptance-tests`. See [AGENTS.md](AGENTS.md).
