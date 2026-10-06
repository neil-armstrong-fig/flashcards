import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {SettingsAccountPlaywright} from "@src/dsl/web-app/components/settings/components/account/playwright/SettingsAccountPlaywright";

/** Who is signed in on this device. */
export class SettingsAccountDsl {
  private readonly playwright: SettingsAccountPlaywright;

  constructor(page: Page) {
    this.playwright = new SettingsAccountPlaywright(page);
  }

  /** Signs out, which closes the app to the learner. */
  async signOut(): Promise<void> {
    try {
      await this.playwright.signOut();
    } catch (error) {
      throw new DslError("Failed to sign out", error);
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      return await this.playwright.signedIn();
    } catch (error) {
      throw new DslError("Failed to tell whether the learner is signed in", error);
    }
  }

  async getSignedInEmail(): Promise<string> {
    try {
      return await this.playwright.signedInEmail();
    } catch (error) {
      throw new DslError("Failed to read who is signed in", error);
    }
  }
}
