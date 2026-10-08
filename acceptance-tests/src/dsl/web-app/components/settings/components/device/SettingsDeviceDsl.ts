import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {SettingsDevicePlaywright} from "@src/dsl/web-app/components/settings/components/device/playwright/SettingsDevicePlaywright";

/** What this device keeps for the learner, and clearing it. */
export class SettingsDeviceDsl {
  private readonly playwright: SettingsDevicePlaywright;

  constructor(page: Page) {
    this.playwright = new SettingsDevicePlaywright(page);
  }

  /** Asks to clear this device, which is only done once the learner confirms. */
  async startClearing(): Promise<void> {
    try {
      await this.playwright.startClearing();
    } catch (error) {
      throw new DslError("Failed to start clearing this device", error);
    }
  }

  /** Leaves everything on the device as it was. */
  async cancelClearing(): Promise<void> {
    try {
      await this.playwright.cancelClearing();
    } catch (error) {
      throw new DslError("Failed to cancel clearing this device", error);
    }
  }

  /** Clears the device, and waits for the app to open again. */
  async confirmClearing(): Promise<void> {
    try {
      await this.playwright.confirmClearing();
    } catch (error) {
      throw new DslError("Failed to clear this device", error);
    }
  }

  /** What the learner is told clearing will cost them. */
  async getWarning(): Promise<string> {
    try {
      return await this.playwright.warning();
    } catch (error) {
      throw new DslError("Failed to read the warning about clearing this device", error);
    }
  }
}
