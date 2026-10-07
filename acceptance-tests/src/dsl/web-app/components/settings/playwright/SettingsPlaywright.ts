import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {Theme} from "@flashcards/shared/theme/Theme";
import type {DeckId} from "@src/dsl/web-app/types/DeckId";
import {openDeckSettings} from "@src/dsl/web-app/components/settings/playwright/utils/OpenDeckSettings";

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
    if (await this.page.getByTestId("deck-settings-screen").isVisible()) {
      await this.back();
    }

    await this.page.getByTestId("close-settings").click();
    await this.page.getByTestId("settings-screen").waitFor({state: "detached"});
  }

  async openDeck(deck: DeckId): Promise<void> {
    await openDeckSettings(this.page, deck);
  }

  /** The back button at the top of whichever settings screen is showing. */
  async back(): Promise<void> {
    if (await this.page.getByTestId("deck-settings-screen").isVisible()) {
      await this.page.getByTestId("back-from-deck-settings").click();
      await this.page.getByTestId("deck-settings-screen").waitFor({state: "detached"});
      return;
    }

    await this.page.getByTestId("back-from-settings").click();
    await this.page.getByTestId("settings-screen").waitFor({state: "detached"});
  }

  async isShown(): Promise<boolean> {
    return await this.page.getByTestId("settings-screen").isVisible();
  }

  async isDeckShown(deck: DeckId): Promise<boolean> {
    return await this.page.getByTestId(`deck-settings-screen-${deck}`).isVisible();
  }
}
