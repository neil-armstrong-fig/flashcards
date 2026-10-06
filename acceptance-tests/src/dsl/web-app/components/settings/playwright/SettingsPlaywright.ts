import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {Theme} from "@language-learning/shared/theme/Theme";

export class SettingsPlaywright extends BaseComponent {
  private readonly themeChoices: Record<Theme, Locator>;

  constructor(page: Page) {
    super(page);
    this.themeChoices = {
      system: page.getByTestId("theme-system"),
      light: page.getByTestId("theme-light"),
      dark: page.getByTestId("theme-dark"),
    };
  }

  async chooseTheme(theme: Theme): Promise<void> {
    await this.themeChoices[theme].check();
  }

  async theme(): Promise<Theme> {
    if (await this.themeChoices.light.isChecked()) {
      return "light";
    }

    if (await this.themeChoices.dark.isChecked()) {
      return "dark";
    }

    return "system";
  }

  async close(): Promise<void> {
    await this.page.getByTestId("close-settings").click();
    await this.page.getByTestId("settings-screen").waitFor({state: "detached"});
  }
}
