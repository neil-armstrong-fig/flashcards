import type {Page} from "@playwright/test";
import type {InstallIcon} from "@src/dsl/web-app/types/InstallIcon";
import type {DeviceColours} from "@src/dsl/web-app/types/DeviceColours";
import {WebAppPlaywright} from "@src/dsl/web-app/playwright/WebAppPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import {BrowseDsl} from "@src/dsl/web-app/components/browse/BrowseDsl";
import {HomeDsl} from "@src/dsl/web-app/components/home/HomeDsl";
import {StrugglingDsl} from "@src/dsl/web-app/components/struggling/StrugglingDsl";
import {SettingsDsl} from "@src/dsl/web-app/components/settings/SettingsDsl";
import {LoginDsl} from "@src/dsl/web-app/components/login/LoginDsl";
import {ReleaseUpdateDsl} from "@src/dsl/web-app/components/release-update/ReleaseUpdateDsl";
import {ReviewDsl} from "@src/dsl/web-app/components/review/ReviewDsl";

/** The whole application. Every area of it is a member of this, never a fixture of its own. */
export class WebAppDsl {
  readonly home: HomeDsl;
  readonly browse: BrowseDsl;
  readonly review: ReviewDsl;
  readonly settings: SettingsDsl;
  readonly struggling: StrugglingDsl;
  readonly releaseUpdate: ReleaseUpdateDsl;
  readonly login: LoginDsl;

  private readonly playwright: WebAppPlaywright;

  constructor(page: Page) {
    this.playwright = new WebAppPlaywright(page);
    this.home = new HomeDsl(page);
    this.browse = new BrowseDsl(page);
    this.review = new ReviewDsl(page);
    this.settings = new SettingsDsl(page);
    this.struggling = new StrugglingDsl(page);
    this.releaseUpdate = new ReleaseUpdateDsl(page);
    this.login = new LoginDsl(page);
  }

  async begin(): Promise<void> {
    try {
      await this.playwright.open();
    } catch (error) {
      throw new DslError("Failed to open the app", error);
    }
  }

  /** Sets what the device asks for, as its owner would in the system settings. The app is reopened to start from it. */
  async setDeviceColours(colours: DeviceColours): Promise<void> {
    try {
      await this.playwright.setDeviceColours(colours);
    } catch (error) {
      throw new DslError(`Failed to make the device ask for ${colours} colours`, error);
    }
  }

  /** Reopens the page and looks at it before the app's own scripts have run, as a learner sees it in the first moments of a load. */
  async reloadBeforeTheAppStarts(): Promise<void> {
    try {
      await this.playwright.reloadBeforeTheAppStarts();
    } catch (error) {
      throw new DslError("Failed to look at the page before the app started", error);
    }
  }

  /** The mouse pointer a learner sees over the first button they can press, as CSS names it (`pointer` is the hand). */
  async getPointerOverAButton(): Promise<string> {
    try {
      return await this.playwright.pointerOverAButton();
    } catch (error) {
      throw new DslError("Failed to read the pointer over a button", error);
    }
  }

  /** How many recordings this device holds, counted in the browser's own storage rather than read off the screen. */
  async getRecordingsOnThisDevice(): Promise<number> {
    try {
      return await this.playwright.recordingsOnThisDevice();
    } catch (error) {
      throw new DslError("Failed to count the recordings on this device", error);
    }
  }

  /** The colour the app asks the browser to paint its own bar (the phone's status bar), as a hex value. */
  async getBrowserBarColour(): Promise<string> {
    try {
      return await this.playwright.browserBarColour();
    } catch (error) {
      throw new DslError("Failed to read the colour of the browser's bar", error);
    }
  }

  /** Whether the app is drawn on a light ground rather than a dark one. */
  async isShownInLightColours(): Promise<boolean> {
    try {
      return await this.playwright.shownInLightColours();
    } catch (error) {
      throw new DslError("Failed to tell whether the app is in light colours", error);
    }
  }

  /** What the browser's tab is titled. */
  async getTabTitle(): Promise<string> {
    try {
      return await this.playwright.tabTitle();
    } catch (error) {
      throw new DslError("Failed to read the title of the browser tab", error);
    }
  }

  /** The name the app gives itself in the install prompt, or nothing when it offers no manifest. */
  async getInstallName(): Promise<string | undefined> {
    try {
      return (await this.playwright.installNames()).name;
    } catch (error) {
      throw new DslError("Failed to read the name the app offers for installing it", error);
    }
  }

  /** The name that sits under the app's icon on a home screen, or nothing when it offers no manifest. */
  async getHomeScreenName(): Promise<string | undefined> {
    try {
      return (await this.playwright.installNames()).shortName;
    } catch (error) {
      throw new DslError("Failed to read the name the app shows under its home screen icon", error);
    }
  }

  /** The icons the app's manifest offers for installing it, each with whether it loads. */
  async getInstallIcons(): Promise<InstallIcon[]> {
    try {
      return await this.playwright.installIcons();
    } catch (error) {
      throw new DslError("Failed to read the icons the app offers for installing it", error);
    }
  }

  /** Whether the app offers a picture for an iPhone's home screen, and it loads. */
  async isHomeScreenIconForIphonesLoaded(): Promise<boolean> {
    try {
      return await this.playwright.homeScreenIconForIphonesLoaded();
    } catch (error) {
      throw new DslError("Failed to tell whether the iPhone home screen icon loads", error);
    }
  }

  /** Opens the app again, as a learner coming back later would. Saved progress stays. */
  async reload(): Promise<void> {
    try {
      await this.playwright.reload();
    } catch (error) {
      throw new DslError("Failed to reopen the app", error);
    }
  }

  /** Wipes what the app keeps in this browser, as a new device would have, and reopens it. What is kept online stays. */
  async forgetThisDevice(): Promise<void> {
    try {
      await this.playwright.forgetThisDevice();
    } catch (error) {
      throw new DslError("Failed to forget this device", error);
    }
  }

  /** Loses the network, as a learner walking out of signal would. The app is already open, and what it saved is all it has. */
  async goOffline(): Promise<void> {
    try {
      await this.playwright.goOffline();
    } catch (error) {
      throw new DslError("Failed to go offline", error);
    }
  }

  /** Lets whole days go by, then reopens the app. */
  async passDays(days: number): Promise<void> {
    try {
      await this.playwright.passDays(days);
    } catch (error) {
      throw new DslError(`Failed to let ${days} days pass`, error);
    }
  }

  /** Lets up to 24 days go by with the app left open. */
  async letDaysPass(days: number): Promise<void> {
    try {
      await this.playwright.letDaysPass(days);
    } catch (error) {
      throw new DslError(`Failed to let ${days} days pass with the app open`, error);
    }
  }
}
