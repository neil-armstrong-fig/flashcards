import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

export class SettingsAccountPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  /** Signs out through the settings, which closes the app to the learner: the sign-in screen is what is left. */
  async signOut(): Promise<void> {
    await this.page.getByTestId("sign-out").click();
    await this.page.getByTestId("login-screen").waitFor();
  }

  async signedIn(): Promise<boolean> {
    await this.page.getByTestId("account").waitFor();

    return await this.page.getByTestId("signed-in").isVisible();
  }

  async signedInEmail(): Promise<string> {
    return await this.page.getByTestId("signed-in-email").innerText();
  }
}
