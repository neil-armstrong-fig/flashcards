import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The sign-in screen, which is all there is to see until the learner has signed in with Google. */
export class LoginPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async shown(): Promise<boolean> {
    return await this.page.getByTestId("login-screen").isVisible();
  }

  async appTitle(): Promise<string> {
    return await this.page.getByTestId("app-title").innerText();
  }

  /** Whether any part of the app can be reached: its home screen, and its way into the settings. */
  async canReachTheApp(): Promise<boolean> {
    const home = await this.page.getByTestId("start-reviewing").isVisible();
    const settings = await this.page.getByTestId("open-settings").isVisible();

    return home || settings;
  }

  /** Signs in through the screen's own button, which leaves the page for Google and comes back with the app open. */
  async signIn(): Promise<void> {
    await this.page.getByTestId("sign-in").click();
    await this.page.getByTestId("app-home").waitFor();
  }
}
