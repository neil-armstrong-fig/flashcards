import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {SettingsStrugglingPlaywright} from "@src/dsl/web-app/components/settings/components/struggling/playwright/SettingsStrugglingPlaywright";

/** What the app does with cards the learner struggles with, and the cards set aside. */
export class SettingsStrugglingDsl {
  private readonly playwright: SettingsStrugglingPlaywright;

  constructor(page: Page) {
    this.playwright = new SettingsStrugglingPlaywright(page);
  }

  /** Keeps the Korean word off the front of the card, so the learner has to listen. */
  /** How many times a card must be forgotten before it counts as struggling. */
  async setStrugglingAfter(times: number): Promise<void> {
    try {
      await this.playwright.setStrugglingAfter(times);
    } catch (error) {
      throw new DslError(`Failed to set cards to struggle after ${times} lapses`, error);
    }
  }

  async getStrugglingAfter(): Promise<number> {
    try {
      return await this.playwright.strugglingAfter();
    } catch (error) {
      throw new DslError("Failed to read when a card counts as struggling", error);
    }
  }

  /** Whether a card is set aside the moment it counts as struggling. */
  async setSetAsideWhenStruggling(on: boolean): Promise<void> {
    try {
      await this.playwright.setSetAsideWhenStruggling(on);
    } catch (error) {
      throw new DslError(`Failed to set setting struggling cards aside to ${on}`, error);
    }
  }

  async isSetAsideWhenStruggling(): Promise<boolean> {
    try {
      return await this.playwright.setAsideWhenStruggling();
    } catch (error) {
      throw new DslError("Failed to read whether struggling cards are set aside", error);
    }
  }

  async setListenOnly(on: boolean): Promise<void> {
    try {
      await this.playwright.setListenOnly(on);
    } catch (error) {
      throw new DslError(`Failed to set listening without reading to ${on}`, error);
    }
  }

  async isListenOnly(): Promise<boolean> {
    try {
      return await this.playwright.listenOnly();
    } catch (error) {
      throw new DslError("Failed to tell whether listening without reading is on", error);
    }
  }

  async getSuspendedCount(): Promise<number> {
    try {
      return await this.playwright.suspendedCount();
    } catch (error) {
      throw new DslError("Failed to read how many cards are suspended", error);
    }
  }

  async unsuspendAll(): Promise<void> {
    try {
      await this.playwright.unsuspendAll();
    } catch (error) {
      throw new DslError("Failed to bring the suspended cards back", error);
    }
  }
}
