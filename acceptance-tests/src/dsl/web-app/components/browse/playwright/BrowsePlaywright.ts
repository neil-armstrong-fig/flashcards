import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {DeckFilter} from "@src/dsl/web-app/components/browse/types/DeckFilter";
import {isDeckId} from "@src/dsl/web-app/types/DeckId";
import type {BrowsedCard} from "@src/dsl/web-app/components/browse/types/BrowsedCard";

/** The screen listing every card in the deck. */
export class BrowsePlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async cardCount(): Promise<number> {
    return Number(await this.page.getByTestId("browse-count").innerText());
  }

  async rows(): Promise<BrowsedCard[]> {
    // One round trip for every row: a list of hundreds of cards would take half a minute read one field at a time.
    return await this.page.getByTestId("browse-card").evaluateAll(rows => {
      const textOf = (row: Element, testId: string): string => {
        return (row.querySelector<HTMLElement>(`[data-testid="${testId}"]`)?.innerText ?? "").trim();
      };

      return rows.map(row => ({
        front: textOf(row, "browse-card-front"),
        back: textOf(row, "browse-card-back"),
        hint: textOf(row, "browse-card-hint"),
        status: textOf(row, "browse-card-status"),
      }));
    });
  }

  async search(text: string): Promise<void> {
    await this.page.getByTestId("browse-search").fill(text);
    await this.page.waitForFunction(query => {
      const field = document.querySelector<HTMLInputElement>('[data-testid="browse-search"]');

      return field?.value === query;
    }, text);
  }

  async deckFilter(): Promise<DeckFilter> {
    const chosen = await this.page.getByTestId("browse-deck-filter").inputValue();

    if (chosen === "all" || isDeckId(chosen)) {
      return chosen;
    }

    throw new Error(`The deck filter shows ${chosen}, which is not a deck.`);
  }

  async chooseDeck(deck: DeckFilter): Promise<void> {
    await this.page.getByTestId("browse-deck-filter").selectOption(deck);
  }

  async nothingFoundShown(): Promise<boolean> {
    return await this.page.getByTestId("browse-nothing-found").isVisible();
  }

  /** Presses play on the row whose front is `front`, and waits until the fake audio element has been asked to play. */
  async play(front: string): Promise<void> {
    const before = await this.page.evaluate(() => window.fakeAudio.played.length);

    await this.page
      .getByTestId("browse-card")
      .filter({has: this.page.getByTestId("browse-card-front").getByText(front, {exact: true})})
      .getByTestId("browse-card-play")
      .click();
    await this.page.waitForFunction(count => window.fakeAudio.played.length > count, before);
  }

  async cardStruggling(front: string): Promise<boolean> {
    const row = this.page
      .getByTestId("browse-card")
      .filter({has: this.page.getByTestId("browse-card-front").getByText(front, {exact: true})});

    await row.getByTestId("browse-card-status").waitFor();

    return (await row.getByTestId("browse-card-struggling").count()) > 0;
  }

  async romanisationNote(): Promise<string> {
    return await this.page.getByTestId("romanisation-system").innerText();
  }

  async switchVoice(): Promise<void> {
    await this.page.getByTestId("browse-switch-voice").click();
  }

  async switchSpeed(): Promise<void> {
    await this.page.getByTestId("browse-switch-speed").click();
  }

  /** Opens the similars of the row whose front is `front`, and waits for the panel. */
  async openSimilars(front: string): Promise<void> {
    await this.page
      .getByTestId("browse-card")
      .filter({has: this.page.getByTestId("browse-card-front").getByText(front, {exact: true})})
      .getByTestId("browse-card-similars")
      .click();
    await this.page.getByTestId("similar-panel").waitFor();
  }

  async close(): Promise<void> {
    await this.page.getByTestId("close-browse").click();
    await this.page.getByTestId("browse-screen").waitFor({state: "detached"});
  }
}
