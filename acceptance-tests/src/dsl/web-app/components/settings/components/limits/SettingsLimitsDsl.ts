import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {STARTER_DECK_ID} from "@src/dsl/web-app/types/DeckId";
import type {DeckId} from "@src/dsl/web-app/types/DeckId";
import {SettingsLimitsPlaywright} from "@src/dsl/web-app/components/settings/components/limits/playwright/SettingsLimitsPlaywright";

/** How much the learner takes on: new cards and reviews a day, the daily goal and how much to remember. */
export class SettingsLimitsDsl {
  private readonly playwright: SettingsLimitsPlaywright;

  constructor(page: Page) {
    this.playwright = new SettingsLimitsPlaywright(page);
  }

  /** How many new cards of a deck may be introduced each day. */
  async setNewCardsPerDay(count: number, deck: DeckId = STARTER_DECK_ID): Promise<void> {
    try {
      await this.playwright.setNewCardsPerDay(count, deck);
    } catch (error) {
      throw new DslError(`Failed to set new ${deck} cards per day to ${count}`, error);
    }
  }

  async getNewCardsPerDay(deck: DeckId = STARTER_DECK_ID): Promise<number> {
    try {
      return await this.playwright.newCardsPerDay(deck);
    } catch (error) {
      throw new DslError(`Failed to read new ${deck} cards per day`, error);
    }
  }

  /** How many review cards of a deck may be done each day. */
  async setMaxReviewsPerDay(count: number, deck: DeckId = STARTER_DECK_ID): Promise<void> {
    try {
      await this.playwright.setMaxReviewsPerDay(count, deck);
    } catch (error) {
      throw new DslError(`Failed to set ${deck} reviews per day to ${count}`, error);
    }
  }

  async getMaxReviewsPerDay(deck: DeckId = STARTER_DECK_ID): Promise<number> {
    try {
      return await this.playwright.maxReviewsPerDay(deck);
    } catch (error) {
      throw new DslError(`Failed to read ${deck} reviews per day`, error);
    }
  }

  async setDailyGoal(cards: number): Promise<void> {
    try {
      await this.playwright.setDailyGoal(cards);
    } catch (error) {
      throw new DslError(`Failed to set the daily goal to ${cards} cards`, error);
    }
  }

  async getDailyGoal(): Promise<number> {
    try {
      return await this.playwright.dailyGoal();
    } catch (error) {
      throw new DslError("Failed to read the daily goal", error);
    }
  }

  /** Asks to remember this percentage of the cards when they come back. */
  async setDesiredRetention(percent: number): Promise<void> {
    try {
      await this.playwright.setDesiredRetention(percent);
    } catch (error) {
      throw new DslError(`Failed to ask to remember ${percent} percent`, error);
    }
  }

  async getDesiredRetention(): Promise<number> {
    try {
      return await this.playwright.desiredRetention();
    } catch (error) {
      throw new DslError("Failed to read how much the learner asks to remember", error);
    }
  }
}
