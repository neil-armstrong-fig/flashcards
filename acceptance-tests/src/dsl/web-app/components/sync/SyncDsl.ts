import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {SyncPlaywright} from "@src/dsl/web-app/components/sync/playwright/SyncPlaywright";

/** Keeping the learner's progress the same on every device they sign in on. */
export class SyncDsl {
  private readonly playwright: SyncPlaywright;

  constructor(page: Page) {
    this.playwright = new SyncPlaywright(page);
  }

  /** Waits until this device has sent what it did and received what the others did. */
  async waitUntilUpToDate(): Promise<void> {
    try {
      await this.playwright.waitUntilUpToDate();
    } catch (error) {
      throw new DslError("Failed to see this device catch up with the learner's other devices", error);
    }
  }
}
