import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {LoginPlaywright} from "@src/dsl/web-app/components/login/playwright/LoginPlaywright";

/** The sign-in screen: the whole app is behind it, so it is all a signed-out learner is shown. */
export class LoginDsl {
  private readonly playwright: LoginPlaywright;

  constructor(page: Page) {
    this.playwright = new LoginPlaywright(page);
  }

  async isShown(): Promise<boolean> {
    try {
      return await this.playwright.shown();
    } catch (error) {
      throw new DslError("Failed to tell whether the sign-in screen is shown", error);
    }
  }

  /** Whether the home screen or the way into the settings can be seen: not while the sign-in screen is up. */
  async canReachTheApp(): Promise<boolean> {
    try {
      return await this.playwright.canReachTheApp();
    } catch (error) {
      throw new DslError("Failed to tell whether the app can be reached", error);
    }
  }

  /** Signs in with Google, which takes the learner away and brings them back with the app open. */
  async signIn(): Promise<void> {
    try {
      await this.playwright.signIn();
    } catch (error) {
      throw new DslError("Failed to sign in", error);
    }
  }
}
