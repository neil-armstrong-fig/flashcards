import type {Page} from "@playwright/test";
import {SimilarDsl} from "@src/dsl/web-app/components/review/components/similar/SimilarDsl";
import {BrowsePlaywright} from "@src/dsl/web-app/components/browse/playwright/BrowsePlaywright";
import type {DeckFilter} from "@src/dsl/web-app/components/browse/types/DeckFilter";
import {DslError} from "@src/dsl/errors/DslError";
import type {BrowsedCard} from "@src/dsl/web-app/components/browse/types/BrowsedCard";
import {CardFormDsl} from "@src/dsl/web-app/components/browse/components/card-form/CardFormDsl";

/** The list of every card in the deck, with where each one is in its life. */
export class BrowseDsl {
  private readonly playwright: BrowsePlaywright;

  /** The similars panel of a row, which is the same panel as on a card. */
  readonly similar: SimilarDsl;
  readonly cardForm: CardFormDsl;

  constructor(page: Page) {
    this.playwright = new BrowsePlaywright(page);
    this.similar = new SimilarDsl(page);
    this.cardForm = new CardFormDsl(page);
  }

  /** How many cards the list shows right now, after any search. */
  async getCardCount(): Promise<number> {
    try {
      return await this.playwright.cardCount();
    } catch (error) {
      throw new DslError("Failed to read how many cards are listed", error);
    }
  }

  async getRows(): Promise<BrowsedCard[]> {
    try {
      return await this.playwright.rows();
    } catch (error) {
      throw new DslError("Failed to read the listed cards", error);
    }
  }

  /** The deck the list is narrowed to, or `all`. */
  async getDeckFilter(): Promise<DeckFilter> {
    try {
      return await this.playwright.deckFilter();
    } catch (error) {
      throw new DslError("Failed to read which deck the cards are narrowed to", error);
    }
  }

  /** Narrows the list to one deck, or back to every deck with `all`. */
  async chooseDeck(deck: DeckFilter): Promise<void> {
    try {
      await this.playwright.chooseDeck(deck);
    } catch (error) {
      throw new DslError(`Failed to narrow the cards to ${deck}`, error);
    }
  }

  /** Narrows the list to the cards whose words, meaning or way of saying it contain the text. */
  async search(text: string): Promise<void> {
    try {
      await this.playwright.search(text);
    } catch (error) {
      throw new DslError(`Failed to search the cards for ${text}`, error);
    }
  }

  async isNothingFoundShown(): Promise<boolean> {
    try {
      return await this.playwright.nothingFoundShown();
    } catch (error) {
      throw new DslError("Failed to tell whether the list says nothing was found", error);
    }
  }

  /** Plays the Korean word of the card whose front is `front`. */
  async play(front: string): Promise<void> {
    try {
      await this.playwright.play(front);
    } catch (error) {
      throw new DslError(`Failed to play the card ${front}`, error);
    }
  }

  /** Switches between the female and male voice for everything the app says. It is the same setting as in the settings. */
  /** Whether the learner can make a card of their own: only while signed in. */
  /** Whether the row whose front is `front` is marked as a struggling card. */
  async isCardStruggling(front: string): Promise<boolean> {
    try {
      return await this.playwright.cardStruggling(front);
    } catch (error) {
      throw new DslError(`Failed to tell whether the card ${front} is marked as struggling`, error);
    }
  }

  /** What the list says about how Korean words are written in Latin letters. */
  async getRomanisationNote(): Promise<string> {
    try {
      return await this.playwright.romanisationNote();
    } catch (error) {
      throw new DslError("Failed to read which romanisation the list says it uses", error);
    }
  }

  async switchVoice(): Promise<void> {
    try {
      await this.playwright.switchVoice();
    } catch (error) {
      throw new DslError("Failed to switch the voice", error);
    }
  }

  async switchSpeed(): Promise<void> {
    try {
      await this.playwright.switchSpeed();
    } catch (error) {
      throw new DslError("Failed to switch the speed", error);
    }
  }

  /** Opens the similars of the card whose front is `front`. */
  async openSimilars(front: string): Promise<void> {
    try {
      await this.playwright.openSimilars(front);
    } catch (error) {
      throw new DslError(`Failed to open the similars of ${front}`, error);
    }
  }

  async close(): Promise<void> {
    try {
      await this.playwright.close();
    } catch (error) {
      throw new DslError("Failed to leave the list of cards", error);
    }
  }
}
