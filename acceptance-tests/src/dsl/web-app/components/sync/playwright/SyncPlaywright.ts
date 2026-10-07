import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The line on the home screen that says whether what this device holds is the same as what is kept online. */
export class SyncPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async waitUntilUpToDate(): Promise<void> {
    await this.page.locator('[data-testid="sync-status"][data-state="synced"]').waitFor();
  }
}
