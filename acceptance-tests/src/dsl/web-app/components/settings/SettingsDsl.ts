import type {Page} from "@playwright/test";
import type {Theme} from "@flashcards/shared/theme/Theme";
import {DslError} from "@src/dsl/errors/DslError";
import {SettingsPlaywright} from "@src/dsl/web-app/components/settings/playwright/SettingsPlaywright";
import {SettingsLimitsDsl} from "@src/dsl/web-app/components/settings/components/limits/SettingsLimitsDsl";
import {SettingsVoiceDsl} from "@src/dsl/web-app/components/settings/components/voice/SettingsVoiceDsl";
import {SettingsStrugglingDsl} from "@src/dsl/web-app/components/settings/components/struggling/SettingsStrugglingDsl";
import {SettingsAccountDsl} from "@src/dsl/web-app/components/settings/components/account/SettingsAccountDsl";

/** The settings screen, where the learner decides how much to take on each day. */
export class SettingsDsl {
  private readonly playwright: SettingsPlaywright;

  readonly limits: SettingsLimitsDsl;
  readonly voice: SettingsVoiceDsl;
  readonly struggling: SettingsStrugglingDsl;
  readonly account: SettingsAccountDsl;

  constructor(page: Page) {
    this.playwright = new SettingsPlaywright(page);
    this.limits = new SettingsLimitsDsl(page);
    this.voice = new SettingsVoiceDsl(page);
    this.struggling = new SettingsStrugglingDsl(page);
    this.account = new SettingsAccountDsl(page);
  }

  async chooseTheme(theme: Theme): Promise<void> {
    try {
      await this.playwright.chooseTheme(theme);
    } catch (error) {
      throw new DslError(`Failed to choose the ${theme} colours`, error);
    }
  }

  async getTheme(): Promise<Theme> {
    try {
      return await this.playwright.theme();
    } catch (error) {
      throw new DslError("Failed to read the chosen colours", error);
    }
  }

  async close(): Promise<void> {
    try {
      await this.playwright.close();
    } catch (error) {
      throw new DslError("Failed to close the settings", error);
    }
  }
}
