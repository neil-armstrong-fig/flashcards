import type {Page} from "@playwright/test";
import type {DeckId} from "@src/dsl/web-app/types/DeckId";

/** Gets to a deck's settings from wherever the learner is in the settings: a deck's settings is a screen of its own. */
export async function openDeckSettings(page: Page, deck: DeckId): Promise<void> {
  const screen = page.getByTestId(`deck-settings-screen-${deck}`);
  if (await screen.isVisible()) {
    return;
  }

  if (await page.getByTestId("deck-settings-screen").isVisible()) {
    await page.getByTestId("back-from-deck-settings").click();
  }

  await page.getByTestId(`open-deck-settings-${deck}`).click();
  await screen.waitFor();
}
