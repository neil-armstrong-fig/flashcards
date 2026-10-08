import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {SettingsReminderPlaywright} from "@src/dsl/web-app/components/settings/components/reminder/playwright/SettingsReminderPlaywright";

/** The evening reminder to reach the daily goal: whether it is on and at what hour. */
export class SettingsReminderDsl {
  private readonly playwright: SettingsReminderPlaywright;

  constructor(page: Page) {
    this.playwright = new SettingsReminderPlaywright(page);
  }

  async turnOn(): Promise<void> {
    try {
      await this.playwright.turnOn();
    } catch (error) {
      throw new DslError("Failed to turn the reminder on", error);
    }
  }

  async turnOff(): Promise<void> {
    try {
      await this.playwright.turnOff();
    } catch (error) {
      throw new DslError("Failed to turn the reminder off", error);
    }
  }

  async isOn(): Promise<boolean> {
    try {
      return await this.playwright.isOn();
    } catch (error) {
      throw new DslError("Failed to tell whether the reminder is on", error);
    }
  }

  /** The hour of the day, 0 to 23, the learner is reminded at. */
  async chooseHour(hour: number): Promise<void> {
    try {
      await this.playwright.chooseHour(hour);
    } catch (error) {
      throw new DslError(`Failed to choose ${hour}:00 for the reminder`, error);
    }
  }

  async getHour(): Promise<number> {
    try {
      return await this.playwright.hour();
    } catch (error) {
      throw new DslError("Failed to read the reminder hour", error);
    }
  }

  /** The hour the API will send the reminder at for this device, or `undefined` when it holds no subscription. */
  async getHourHeldByTheApi(): Promise<number | undefined> {
    try {
      return await this.playwright.hourHeldByTheApi();
    } catch (error) {
      throw new DslError("Failed to read the reminder the API holds", error);
    }
  }
}
