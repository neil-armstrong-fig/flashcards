import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {ReleaseUpdatePlaywright} from "@src/dsl/web-app/components/release-update/playwright/ReleaseUpdatePlaywright";

/** The notice that another release of the app is ready, which needs a compiled build to have a service worker at all. */
export class ReleaseUpdateDsl {
  private readonly playwright: ReleaseUpdatePlaywright;

  constructor(page: Page) {
    this.playwright = new ReleaseUpdatePlaywright(page);
  }

  /** Has another release of the app arrive, as a deployment would, and waits until it is installed behind the running one. */
  async makeAvailable(): Promise<void> {
    try {
      await this.playwright.makeAvailable();
    } catch (error) {
      throw new DslError("Failed to make another release available", error);
    }
  }

  async refresh(): Promise<void> {
    try {
      await this.playwright.refresh();
    } catch (error) {
      throw new DslError("Failed to refresh to the new release", error);
    }
  }

  async leaveUntilLater(): Promise<void> {
    try {
      await this.playwright.leaveUntilLater();
    } catch (error) {
      throw new DslError("Failed to leave the new release until later", error);
    }
  }

  async isOffered(): Promise<boolean> {
    try {
      return await this.playwright.isOffered();
    } catch (error) {
      throw new DslError("Failed to tell whether a new release is offered", error);
    }
  }

  async isDismissed(): Promise<boolean> {
    try {
      return await this.playwright.isDismissed();
    } catch (error) {
      throw new DslError("Failed to tell whether the offer went away", error);
    }
  }

  /** Whether the new release is installed and waiting behind the running one. */
  async isWaiting(): Promise<boolean> {
    try {
      return await this.playwright.isWaiting();
    } catch (error) {
      throw new DslError("Failed to tell whether the new release is waiting", error);
    }
  }

  async isAvailableReleaseRunning(): Promise<boolean> {
    try {
      return await this.playwright.isAvailableReleaseRunning();
    } catch (error) {
      throw new DslError("Failed to tell whether the new release is running", error);
    }
  }
}
