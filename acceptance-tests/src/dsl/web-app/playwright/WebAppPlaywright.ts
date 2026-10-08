import type {Page} from "@playwright/test";
import {readManifestIcons} from "@src/dsl/web-app/playwright/install-icons/ReadManifestIcons";
import {readManifestNames} from "@src/dsl/web-app/playwright/manifest-names/ReadManifestNames";
import type {ManifestNames} from "@src/dsl/web-app/playwright/manifest-names/ManifestNames";
import type {InstallIcon} from "@src/dsl/web-app/types/InstallIcon";
import type {DeviceColours} from "@src/dsl/web-app/types/DeviceColours";
import {BasePage} from "@src/dsl/playwright/BasePage";
import type {FakeAccount} from "@src/dsl/web-app/playwright/fake-api/FakeAccount";
import {createFakeApi} from "@src/dsl/web-app/playwright/fake-api/CreateFakeApi";
import {fullHex} from "@src/dsl/web-app/playwright/full-hex/FullHex";
import {installFakeAudio} from "@src/dsl/web-app/playwright/fake-audio/InstallFakeAudio";
import {installFakePush} from "@src/dsl/web-app/playwright/fake-push/InstallFakePush";
import {installFakeVibration} from "@src/dsl/web-app/playwright/fake-vibration/InstallFakeVibration";

/** Where the clock starts. A morning, well clear of the study day's rollover hour. */
const START_OF_TIME = new Date("2026-10-05T10:00:00");

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export class WebAppPlaywright extends BasePage {
  constructor(
    page: Page,
    private readonly account: FakeAccount,
  ) {
    super(page);
  }

  async open(): Promise<void> {
    // The clock is the test's, so a spec about days passing never waits for them.
    await this.page.clock.install({time: START_OF_TIME});
    // Nobody listens to a test run: audio elements write down what they were asked to play instead.
    await this.page.addInitScript(installFakeAudio);
    // Nor does anyone feel one: the phone's vibration motor writes down each buzz instead.
    await this.page.addInitScript(installFakeVibration);
    // Nor does a run reach a push vendor: a stand-in subscribes, and notifications are allowed.
    await this.page.addInitScript(installFakePush);
    // Nor does a run reach the API, which would spend real quota and need a real Google account: a stand-in answers.
    await this.page.route("**/api/**", createFakeApi(this.account));
    // Relative, so the suite does not care where the app is served from.
    await this.page.goto("./");
    await this.page.getByTestId("app-ready").waitFor();
  }

  async setDeviceColours(colours: DeviceColours): Promise<void> {
    await this.page.emulateMedia({colorScheme: colours});
    await this.reload();
  }

  async reloadBeforeTheAppStarts(): Promise<void> {
    // The app's service worker would answer the scripts from its cache, past anything a route can hold back, so it goes first.
    await this.page.evaluate(async () => {
      for (const registration of await navigator.serviceWorker.getRegistrations()) {
        await registration.unregister();
      }
    });
    // The app is a module script, so holding every script back leaves only what the page itself does before it paints.
    await this.page.route("**/*.js", route => route.abort());
    await this.page.reload({waitUntil: "domcontentloaded"});
  }

  async pointerOverAButton(): Promise<string> {
    return await this.page
      .locator("button:enabled")
      .first()
      .evaluate(button => getComputedStyle(button).cursor);
  }

  async recordingsOnThisDevice(): Promise<number> {
    return await this.page.evaluate(async () => {
      if (!(await caches.has("recordings-v1"))) {
        return 0;
      }

      return (await (await caches.open("recordings-v1")).keys()).length;
    });
  }

  async browserBarColour(): Promise<string> {
    const colour = await this.page.locator('meta[name="theme-color"]').getAttribute("content");

    return fullHex(colour ?? "");
  }

  async shownInLightColours(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const [red = 0, green = 0, blue = 0] =
        getComputedStyle(document.body).backgroundColor.match(/\d+/g)?.map(Number) ?? [];

      return (red + green + blue) / 3 > 128;
    });
  }

  /** How long each buzz the app asked the phone for was, in milliseconds, oldest first. */
  async vibrations(): Promise<readonly number[]> {
    return await this.page.evaluate(() => [...window.fakeVibration.buzzes]);
  }

  /** What the browser's tab is titled, as a learner sees it in the tab strip or a bookmark. */
  async tabTitle(): Promise<string> {
    return await this.page.title();
  }

  /** What the manifest calls the app, in full and for under its icon. Nothing when the app offers no manifest. */
  async installNames(): Promise<ManifestNames> {
    const manifestUrl = await this.manifestUrl();

    if (manifestUrl === undefined) {
      return {};
    }

    return readManifestNames(await (await this.page.request.get(manifestUrl)).json());
  }

  async installIcons(): Promise<InstallIcon[]> {
    const manifestUrl = await this.manifestUrl();

    if (manifestUrl === undefined) {
      return [];
    }

    const icons = readManifestIcons(await (await this.page.request.get(manifestUrl)).json());
    const installIcons: InstallIcon[] = [];

    for (const icon of icons) {
      const response = await this.page.request.get(new URL(icon.src, manifestUrl).href);

      installIcons.push({
        sizes: icon.sizes,
        type: icon.type,
        purpose: icon.purpose,
        loads: response.ok() && (response.headers()["content-type"] ?? "").startsWith(icon.type),
      });
    }

    return installIcons;
  }

  private async manifestUrl(): Promise<string | undefined> {
    const manifestAddress = await this.page
      .locator('link[rel="manifest"]')
      .getAttribute("href")
      .then(href => href ?? undefined);

    if (manifestAddress === undefined) {
      return undefined;
    }

    return new URL(manifestAddress, this.page.url()).href;
  }

  async homeScreenIconForIphonesLoaded(): Promise<boolean> {
    return await this.page.evaluate(async () => {
      const link = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');

      if (link === null) {
        return false;
      }

      const response = await fetch(link.href);

      return response.ok && (response.headers.get("content-type") ?? "").startsWith("image/png");
    });
  }

  /** Opens the app again at its start address, as a learner coming back to it would, whichever screen they left it on. */
  async reload(): Promise<void> {
    await this.page.goto("./");
    await this.page.getByTestId("app-ready").waitFor();
  }

  /** Wipes the small settings and word lists the app keeps in the browser, as a new device would have, then reopens the app. */
  async forgetThisDevice(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    await this.reload();
  }

  /**
   * Cuts the connection once the service worker is in charge of the page, which is what lets the app carry on without one.
   * Only a compiled build registers the worker, so this needs `pnpm start:preview`, not the development server.
   */
  async goOffline(): Promise<void> {
    // The worker takes charge once it has kept every file the app needs, recordings included (some 11 MB), which is longer than
    // an ordinary action's five seconds when two specs are installing it at once.
    await this.page.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, {timeout: 30_000});
    await this.page.context().setOffline(true);
  }

  /**
   * Moves the clock on and reloads, as a learner opening the app again on a later day would. The clock is set rather than
   * fast-forwarded: `fastForward` takes a 32-bit number of milliseconds, which is under a month.
   */
  async passDays(days: number): Promise<void> {
    const now = await this.page.evaluate(() => Date.now());

    await this.page.clock.setSystemTime(now + days * DAY_IN_MS);
    await this.reload();
  }

  /**
   * Lets time go by with the app left open, so what it does on its own as time passes can be seen. The clock is fast-forwarded,
   * which fires the app's timers once and takes a 32-bit number of milliseconds, so it cannot span more than 24 days.
   */
  async letDaysPass(days: number): Promise<void> {
    await this.page.clock.fastForward(days * DAY_IN_MS);
  }
}
