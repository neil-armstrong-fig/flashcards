import type {Page} from "@playwright/test";
import type {DeckDueCounts} from "@src/dsl/web-app/components/home/types/DeckDueCounts";
import type {NarrowFocus} from "@src/dsl/web-app/types/NarrowFocus";
import type {OfflineStatus} from "@src/dsl/web-app/components/home/types/OfflineStatus";
import {DslError} from "@src/dsl/errors/DslError";
import {STARTER_DECK_ID} from "@src/dsl/web-app/types/DeckId";
import type {DeckId} from "@src/dsl/web-app/types/DeckId";
import {HomePlaywright} from "@src/dsl/web-app/components/home/playwright/HomePlaywright";

/** The home screen, where today's study is summarised. */
export class HomeDsl {
  private readonly playwright: HomePlaywright;

  constructor(page: Page) {
    this.playwright = new HomePlaywright(page);
  }

  /** The name the screen gives the app at its top. */
  async getAppTitle(): Promise<string> {
    try {
      return await this.playwright.appTitle();
    } catch (error) {
      throw new DslError("Failed to read the app's name from the home screen", error);
    }
  }

  /** How many cards of a deck are waiting today, within that deck's own limits. */
  async getCardsDueToday(deck: DeckId = STARTER_DECK_ID): Promise<number> {
    try {
      return await this.playwright.cardsDueToday(deck);
    } catch (error) {
      throw new DslError(`Failed to read how many ${deck} cards are due today`, error);
    }
  }

  /** What is waiting in a deck today, split into new cards, cards being learned and cards to review. */
  async getDeckDueCounts(deck: DeckId): Promise<DeckDueCounts> {
    try {
      return await this.playwright.deckDueCounts(deck);
    } catch (error) {
      throw new DslError(`Failed to read what kind of ${deck} cards are waiting today`, error);
    }
  }

  /** Whether a deck is picked out as having cards waiting today. */
  async isDeckHighlighted(deck: DeckId): Promise<boolean> {
    try {
      return await this.playwright.deckHighlighted(deck);
    } catch (error) {
      throw new DslError(`Failed to tell whether ${deck} is highlighted`, error);
    }
  }

  /** Starts studying only part of a deck's work for today: just its new cards, or just the cards the learner is struggling with. */
  async startReviewingOnly(deck: DeckId, focus: NarrowFocus): Promise<void> {
    try {
      await this.playwright.startReviewingOnly(deck, focus);
    } catch (error) {
      throw new DslError(`Failed to study only the ${focus} cards of ${deck}`, error);
    }
  }

  /** Whether the deck's row offers to study only its new cards, or only its struggling ones. */
  async canStudyOnly(deck: DeckId, focus: NarrowFocus): Promise<boolean> {
    try {
      return await this.playwright.canStudyOnly(deck, focus);
    } catch (error) {
      throw new DslError(`Failed to tell whether only the ${focus} cards of ${deck} can be studied`, error);
    }
  }

  /** How many cards that narrower session holds, as the offer says. */
  async getStudyOnlyCount(deck: DeckId, focus: NarrowFocus): Promise<number> {
    try {
      return await this.playwright.studyOnlyCount(deck, focus);
    } catch (error) {
      throw new DslError(`Failed to read how many ${focus} cards of ${deck} the offer holds`, error);
    }
  }

  /** How many cards the deck offers to look ahead at: those not due until a later day. 0 where nothing is offered. */
  async getLookAheadCount(deck: DeckId): Promise<number> {
    try {
      return await this.playwright.lookAheadCount(deck);
    } catch (error) {
      throw new DslError(`Failed to read how many ${deck} cards can be looked ahead at`, error);
    }
  }

  /** Starts a look ahead at cards not yet due, whose answers change nothing. */
  async lookAhead(deck: DeckId): Promise<void> {
    try {
      await this.playwright.lookAhead(deck);
    } catch (error) {
      throw new DslError(`Failed to look ahead at the ${deck} cards`, error);
    }
  }

  /** How many of the deck's recordings are kept on this device, and how many it has in all. */
  async getOfflineStatus(deck: DeckId): Promise<OfflineStatus> {
    try {
      return await this.playwright.offlineStatus(deck);
    } catch (error) {
      throw new DslError(`Failed to read how much of ${deck} is kept offline`, error);
    }
  }

  /** Asks for every recording of the deck to be kept on the device, and waits until they all are. */
  async keepOffline(deck: DeckId): Promise<void> {
    try {
      await this.playwright.keepOffline(deck);
    } catch (error) {
      throw new DslError(`Failed to keep ${deck} offline`, error);
    }
  }

  /** How many cards the learner aims to review each day. */
  async getDailyGoal(): Promise<number> {
    try {
      return await this.playwright.dailyGoal();
    } catch (error) {
      throw new DslError("Failed to read the daily goal", error);
    }
  }

  /** How many different cards have been answered today. */
  async getCardsReviewedToday(): Promise<number> {
    try {
      return await this.playwright.cardsReviewedToday();
    } catch (error) {
      throw new DslError("Failed to read how many cards have been reviewed today", error);
    }
  }

  /** Whether today's goal has been reached. */
  async isDailyGoalMet(): Promise<boolean> {
    try {
      return await this.playwright.dailyGoalMet();
    } catch (error) {
      throw new DslError("Failed to tell whether the daily goal is met", error);
    }
  }

  /** Starts a session on one deck: a session never mixes decks. */
  async startReviewing(deck: DeckId = STARTER_DECK_ID): Promise<void> {
    try {
      await this.playwright.startReviewing(deck);
    } catch (error) {
      throw new DslError(`Failed to start reviewing ${deck}`, error);
    }
  }

  /** Opens the list of every card. */
  async openBrowse(): Promise<void> {
    try {
      await this.playwright.openBrowse();
    } catch (error) {
      throw new DslError("Failed to open the list of cards", error);
    }
  }

  /** How many cards are on the Struggling list. */
  async getStrugglingCount(): Promise<number> {
    try {
      return await this.playwright.strugglingCount();
    } catch (error) {
      throw new DslError("Failed to read how many cards are struggling", error);
    }
  }

  /** Opens the list of cards the learner keeps forgetting. */
  async openStruggling(): Promise<void> {
    try {
      await this.playwright.openStruggling();
    } catch (error) {
      throw new DslError("Failed to open the struggling list", error);
    }
  }

  async openSettings(): Promise<void> {
    try {
      await this.playwright.openSettings();
    } catch (error) {
      throw new DslError("Failed to open the settings", error);
    }
  }
}
