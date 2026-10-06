import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import type {NewCardWords} from "@src/dsl/web-app/components/browse/types/NewCardWords";
import {CardFormPlaywright} from "@src/dsl/web-app/components/browse/components/card-form/playwright/CardFormPlaywright";

/** Adding, editing and deleting the learner's own cards. */
export class CardFormDsl {
  private readonly playwright: CardFormPlaywright;

  constructor(page: Page) {
    this.playwright = new CardFormPlaywright(page);
  }

  async canAddCard(): Promise<boolean> {
    try {
      return await this.playwright.canAddCard();
    } catch (error) {
      throw new DslError("Failed to tell whether a card can be added", error);
    }
  }

  /** Makes a card of the learner's own, which is kept online and gets its recordings, and waits until it is listed or refused. */
  async addCard(card: NewCardWords): Promise<void> {
    try {
      await this.playwright.addCard(card);
    } catch (error) {
      throw new DslError(`Failed to add a card for ${card.word}`, error);
    }
  }

  /** Types the Korean word of a card of the learner's own, without sending it, so the app can suggest how it is said. */
  async typeNewCardWord(word: string): Promise<void> {
    try {
      await this.playwright.typeNewCardWord(word);
    } catch (error) {
      throw new DslError(`Failed to type the new card's word ${word}`, error);
    }
  }

  /** Types over how the new card's word is said, as a learner correcting the app's suggestion. */
  async typeNewCardRomanisation(text: string): Promise<void> {
    try {
      await this.playwright.typeNewCardRomanisation(text);
    } catch (error) {
      throw new DslError(`Failed to type the new card's romanisation ${text}`, error);
    }
  }

  /** How the new card's word is said, as the form now has it: the app's suggestion, or what the learner typed over it. */
  async getNewCardRomanisation(): Promise<string> {
    try {
      return await this.playwright.newCardRomanisation();
    } catch (error) {
      throw new DslError("Failed to read the new card's romanisation", error);
    }
  }

  /** Why the last card could not be added. */
  async getAddCardError(): Promise<string> {
    try {
      return await this.playwright.addCardError();
    } catch (error) {
      throw new DslError("Failed to read why the card was refused", error);
    }
  }

  /** Whether the card whose front is `front` can be deleted: only the learner's own, never the deck's. */
  async canDeleteCard(front: string): Promise<boolean> {
    try {
      return await this.playwright.canDeleteCard(front);
    } catch (error) {
      throw new DslError(`Failed to tell whether ${front} can be deleted`, error);
    }
  }

  /** Deletes the learner's own card, both of its directions, here and online. */
  async deleteCard(front: string): Promise<void> {
    try {
      await this.playwright.deleteCard(front);
    } catch (error) {
      throw new DslError(`Failed to delete the card ${front}`, error);
    }
  }

  /** Whether the card whose front is `front` can be edited: only the learner's own, never the deck's. */
  async canEditCard(front: string): Promise<boolean> {
    try {
      return await this.playwright.canEditCard(front);
    } catch (error) {
      throw new DslError(`Failed to tell whether ${front} can be edited`, error);
    }
  }

  /** Changes the words of the learner's own card, keeping where it is in its life, and waits until it is saved or refused. */
  async editCard(front: string, card: NewCardWords): Promise<void> {
    try {
      await this.playwright.editCard(front, card);
    } catch (error) {
      throw new DslError(`Failed to edit the card ${front}`, error);
    }
  }

  /** Why the last edit was refused. */
  async getEditCardError(): Promise<string> {
    try {
      return await this.playwright.editCardError();
    } catch (error) {
      throw new DslError("Failed to read why the edit was refused", error);
    }
  }
}
