import {test as base} from "@playwright/test";
import {WebAppDsl} from "@src/dsl/web-app/WebAppDsl";

/**
 * The DSL objects a spec can ask for. Each one arrives ready to use: navigated, and wrapped so the
 * spec never touches a Playwright locator.
 *
 * There is one, deliberately: `webApp` is the whole application, and every area of it is reached through
 * a member of that rather than through a fixture of its own.
 *
 * Handing the browser to the DSL happens here. A `*Dsl` may name a `Page` for building its own
 * `*Playwright` counterpart and for nothing else: it never stores one, and a lint rule says so.
 */
export interface AcceptanceTestFixtures {
  webApp: WebAppDsl;
}

export const test = base.extend<AcceptanceTestFixtures>({
  webApp: async ({page}, use) => {
    const webApp = new WebAppDsl(page);

    await webApp.begin();
    await use(webApp);
  },
});

export {expect} from "@playwright/test";
