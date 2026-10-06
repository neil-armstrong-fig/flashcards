import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {MoreOptionsPlaywright} from "@src/dsl/web-app/components/review/components/more-options/playwright/MoreOptionsPlaywright";
import type {ExtraAction} from "@src/dsl/web-app/components/review/components/more-options/types/ExtraAction";

/** The rarely used actions on a card (a picture, a note, hard, bury, suspend), kept in a dialog so they are not tapped by accident. */
export class MoreOptionsDsl {
  private readonly playwright: MoreOptionsPlaywright;

  constructor(page: Page) {
    this.playwright = new MoreOptionsPlaywright(page);
  }

  async open(): Promise<void> {
    try {
      await this.playwright.open();
    } catch (error) {
      throw new DslError("Failed to open the more options", error);
    }
  }

  async close(): Promise<void> {
    try {
      await this.playwright.close();
    } catch (error) {
      throw new DslError("Failed to close the more options", error);
    }
  }

  async isOpen(): Promise<boolean> {
    try {
      return await this.playwright.isOpen();
    } catch (error) {
      throw new DslError("Failed to tell whether the more options are open", error);
    }
  }

  /** Whether the way in to the more options is on the card. */
  async isOffered(): Promise<boolean> {
    try {
      return await this.playwright.moreOptionsOffered();
    } catch (error) {
      throw new DslError("Failed to tell whether the more options are offered", error);
    }
  }

  /** Which of the extra actions can be seen right now. */
  async getActionsOnScreen(): Promise<ExtraAction[]> {
    try {
      return await this.playwright.actionsOnScreen();
    } catch (error) {
      throw new DslError("Failed to read which extra actions are on screen", error);
    }
  }

  /** Hides, or shows, the target-language word when it is on the front of the cards of the deck being studied. */
  async setTargetTextHidden(hidden: boolean): Promise<void> {
    try {
      await this.playwright.setTargetTextHidden(hidden);
    } catch (error) {
      throw new DslError(`Failed to ${hidden ? "hide" : "show"} the target text`, error);
    }
  }
}
