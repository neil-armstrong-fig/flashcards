import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

export class SettingsDevicePlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async startClearing(): Promise<void> {
    await this.page.getByTestId("clear-this-device").click();
    await this.page.getByTestId("clear-this-device-dialog").waitFor();
  }

  async cancelClearing(): Promise<void> {
    await this.page.getByTestId("cancel-clear-this-device").click();
    await this.page.getByTestId("clear-this-device-dialog").waitFor({state: "hidden"});
  }

  /** The app reloads itself when the device is cleared, so the wait is for the page to load again and open the settings it was on. */
  async confirmClearing(): Promise<void> {
    const reloaded = this.page.waitForEvent("load");

    await this.page.getByTestId("confirm-clear-this-device").click();
    await reloaded;
    await this.page.getByTestId("settings-screen").waitFor();
  }

  async warning(): Promise<string> {
    return await this.page.getByTestId("clear-this-device-warning").innerText();
  }
}
