import {test as base} from "@playwright/test";
import {newFakeAccount} from "@src/dsl/web-app/playwright/fake-api/NewFakeAccount";
import {WebAppDsl} from "@src/dsl/web-app/WebAppDsl";
import type {FakeAccount} from "@src/dsl/web-app/playwright/fake-api/FakeAccount";

/**
 * The DSL objects a spec can ask for. Each one arrives ready to use: navigated, and wrapped so the
 * spec never touches a Playwright locator.
 *
 * `webApp` is the whole application, and every area of it is reached through a member of that rather than through a fixture
 * of its own. `secondDevice` is the same learner's other phone or laptop: a browser of its own (nothing stored is shared) over the
 * same account online. It is not opened until a spec calls `begin()`, so most specs never pay for it.
 *
 * Handing the browser to the DSL happens here. A `*Dsl` may name a `Page` for building its own
 * `*Playwright` counterpart and for nothing else: it never stores one, and a lint rule says so.
 */
export interface AcceptanceTestFixtures {
  webApp: WebAppDsl;
  secondDevice: WebAppDsl;
}

interface HiddenFixtures {
  account: FakeAccount;
}

export const test = base.extend<AcceptanceTestFixtures & HiddenFixtures>({
  // Playwright reads a fixture's dependencies off this destructuring, so it must be written even when there are none.
  // eslint-disable-next-line no-empty-pattern
  account: async ({}, use) => {
    await use(newFakeAccount());
  },
  webApp: async ({page, account}, use) => {
    const webApp = new WebAppDsl(page, account);

    await webApp.begin();
    await use(webApp);
  },
  secondDevice: async (
    {browser, account, baseURL, viewport, userAgent, isMobile, hasTouch, deviceScaleFactor},
    use,
  ) => {
    const context = await browser.newContext({
      baseURL,
      viewport,
      userAgent,
      isMobile,
      hasTouch,
      deviceScaleFactor,
      reducedMotion: "reduce",
    });

    await use(new WebAppDsl(await context.newPage(), account));
    await context.close();
  },
});

export {expect} from "@playwright/test";
