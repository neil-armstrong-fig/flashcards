import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

export class SettingsStrugglingPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async setStrugglingAfter(times: number): Promise<void> {
    await this.page.getByTestId("struggling-after").fill(String(times));
  }

  async strugglingAfter(): Promise<number> {
    return Number(await this.page.getByTestId("struggling-after").inputValue());
  }

  async setSetAsideWhenStruggling(on: boolean): Promise<void> {
    await this.page.getByTestId("set-aside-when-struggling").setChecked(on);
  }

  async setAsideWhenStruggling(): Promise<boolean> {
    return await this.page.getByTestId("set-aside-when-struggling").isChecked();
  }

  async suspendedCount(): Promise<number> {
    return Number(await this.page.getByTestId("suspended-count").innerText());
  }

  async unsuspendAll(): Promise<void> {
    await this.page.getByTestId("unsuspend-all").click();
    await this.page.waitForFunction(
      () => document.querySelector('[data-testid="suspended-count"]')?.textContent === "0",
    );
  }
}
