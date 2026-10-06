import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {ReviewStrugglingPlaywright} from "@src/dsl/web-app/components/review/components/struggling/playwright/ReviewStrugglingPlaywright";

/** The struggling list as the review screen meets it: marking a card hard, and the pointer at the end of a session. */
export class ReviewStrugglingDsl {
  private readonly playwright: ReviewStrugglingPlaywright;

  constructor(page: Page) {
    this.playwright = new ReviewStrugglingPlaywright(page);
  }

  /** How many struggling cards the end of the session points out, or 0 where it says nothing. */
  async getStrugglingNotice(): Promise<number> {
    try {
      return await this.playwright.strugglingNotice();
    } catch (error) {
      throw new DslError("Failed to read the struggling notice", error);
    }
  }

  /** Follows the end of the session's pointer to the Struggling list. */
  async openStrugglingFromSession(): Promise<void> {
    try {
      await this.playwright.openStrugglingFromSession();
    } catch (error) {
      throw new DslError("Failed to open the struggling list from the end of the session", error);
    }
  }

  /** Says the card on screen is hard, putting it on the Struggling list now. */
  async markHard(): Promise<void> {
    try {
      await this.playwright.markHard();
    } catch (error) {
      throw new DslError("Failed to mark the card as hard", error);
    }
  }

  /** Whether the card on screen is on the Struggling list, for any reason. */
  async isOnStrugglingList(): Promise<boolean> {
    try {
      return await this.playwright.onStrugglingList();
    } catch (error) {
      throw new DslError("Failed to tell whether the card is on the struggling list", error);
    }
  }
}
