import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

const ACCEPTANCE_RELEASE_PARAMETER = "acceptance-release";

type NoticeState = "visible" | "hidden";

/** The release notice and the real service-worker registration beneath it. */
export class ReleaseUpdatePlaywright extends BaseComponent {
  private readonly notice: Locator;
  private readonly refreshButton: Locator;
  private readonly laterButton: Locator;

  constructor(page: Page) {
    super(page);
    this.notice = page.getByTestId("release-update");
    this.refreshButton = page.getByTestId("release-update-refresh");
    this.laterButton = page.getByTestId("release-update-later");
  }

  /**
   * Registers the same worker script under a different address, which the browser treats as a new release: it installs and
   * waits behind the one running, exactly as a deployed update would.
   */
  async makeAvailable(): Promise<void> {
    await this.page.evaluate(async parameter => {
      const current = await navigator.serviceWorker.ready;

      if (!current.active) {
        throw new Error("The app has no active service worker");
      }

      const releaseUrl = new URL(current.active.scriptURL);

      releaseUrl.searchParams.set(parameter, "true");
      await navigator.serviceWorker.register(releaseUrl, {scope: current.scope, updateViaCache: "none"});
    }, ACCEPTANCE_RELEASE_PARAMETER);

    await this.page.waitForFunction(async parameter => {
      const registration = await navigator.serviceWorker.getRegistration();
      const release = [registration?.installing, registration?.waiting, registration?.active].find(worker => {
        return worker && new URL(worker.scriptURL).searchParams.has(parameter);
      });

      return release?.state === "installed" || release?.state === "activated";
    }, ACCEPTANCE_RELEASE_PARAMETER);
  }

  async refresh(): Promise<void> {
    await Promise.all([
      this.page.waitForEvent("framenavigated", frame => frame === this.page.mainFrame()),
      this.refreshButton.click(),
    ]);
    await this.page.getByTestId("app-ready").waitFor();
  }

  async leaveUntilLater(): Promise<void> {
    await this.laterButton.click();
  }

  async isOffered(): Promise<boolean> {
    return await this.becomes("visible");
  }

  async isDismissed(): Promise<boolean> {
    return await this.becomes("hidden");
  }

  async isWaiting(): Promise<boolean> {
    return await this.page.evaluate(async parameter => {
      const registration = await navigator.serviceWorker.getRegistration();

      return Boolean(registration?.waiting && new URL(registration.waiting.scriptURL).searchParams.has(parameter));
    }, ACCEPTANCE_RELEASE_PARAMETER);
  }

  async isAvailableReleaseRunning(): Promise<boolean> {
    return await this.page.evaluate(parameter => {
      const controller = navigator.serviceWorker.controller;

      return Boolean(controller && new URL(controller.scriptURL).searchParams.has(parameter));
    }, ACCEPTANCE_RELEASE_PARAMETER);
  }

  private async becomes(state: NoticeState): Promise<boolean> {
    try {
      await this.notice.waitFor({state});

      return true;
    } catch {
      return false;
    }
  }
}
