import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {StrugglingPlaywright} from "@src/dsl/web-app/components/struggling/playwright/StrugglingPlaywright";
import type {StrugglingCard} from "@src/dsl/web-app/components/struggling/types/StrugglingCard";

/** The Struggling list: the cards the learner has forgotten again and again. */
export class StrugglingDsl {
  private readonly playwright: StrugglingPlaywright;

  constructor(page: Page) {
    this.playwright = new StrugglingPlaywright(page);
  }

  async getCards(): Promise<StrugglingCard[]> {
    try {
      return await this.playwright.cards();
    } catch (error) {
      throw new DslError("Failed to read the struggling cards", error);
    }
  }

  /** Brings a suspended card back into the reviews from the list. It stays on the list while it is struggling. */
  async bringBack(front: string): Promise<void> {
    try {
      await this.playwright.bringBack(front);
    } catch (error) {
      throw new DslError(`Failed to bring back the card ${front}`, error);
    }
  }

  async close(): Promise<void> {
    try {
      await this.playwright.close();
    } catch (error) {
      throw new DslError("Failed to leave the struggling list", error);
    }
  }
}
